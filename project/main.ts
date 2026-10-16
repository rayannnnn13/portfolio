interface Experience {
    title: string;
    organization: string;
    period: string;
    description: string;
}

interface Skill {
    name: string;
    description: string;
    level: "beginner" | "intermediate" | "expert";
}

interface Formation extends Experience {}

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    technologies: string[];
    url: string;
    image: string;
    achievements: string[];
    challenge: string;
    learning: string;
}

interface CvData {
    experiences: Experience[];
    skills: Skill[];
    formations: Formation[];
    projects: Project[];
    upcoming: Experience[];
}

const levelLabels: Record<Skill["level"], string> = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    expert: "Expert"
};

const profileScreen = document.getElementById("profile-screen");
const openProfile = document.getElementById("open-profile");
const site = document.getElementById("site");
const mainContent = document.getElementById("main-content");

if (
    profileScreen instanceof HTMLElement &&
    openProfile instanceof HTMLButtonElement &&
    site instanceof HTMLElement
) {
    openProfile.addEventListener("click", () => {
        profileScreen.hidden = true;
        site.hidden = false;
        mainContent?.focus();
    });
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isExperience(value: unknown): value is Experience {
    return isObject(value) &&
        typeof value.title === "string" &&
        typeof value.organization === "string" &&
        typeof value.period === "string" &&
        typeof value.description === "string";
}

function isSkill(value: unknown): value is Skill {
    return isObject(value) &&
        typeof value.name === "string" &&
        typeof value.description === "string" &&
        (
            value.level === "beginner" ||
            value.level === "intermediate" ||
            value.level === "expert"
        );
}

function isProject(value: unknown): value is Project {
    return isObject(value) &&
        typeof value.id === "string" &&
        typeof value.title === "string" &&
        typeof value.category === "string" &&
        typeof value.description === "string" &&
        Array.isArray(value.technologies) &&
        value.technologies.every(
            (technology: unknown) => typeof technology === "string"
        ) &&
        typeof value.url === "string" &&
        typeof value.image === "string" &&
        Array.isArray(value.achievements) &&
        value.achievements.every((item: unknown) => typeof item === "string") &&
        typeof value.challenge === "string" &&
        typeof value.learning === "string";
}

function isCvData(value: unknown): value is CvData {
    return isObject(value) &&
        Array.isArray(value.experiences) &&
        value.experiences.every(isExperience) &&
        Array.isArray(value.skills) &&
        value.skills.every(isSkill) &&
        Array.isArray(value.formations) &&
        value.formations.every(isExperience) &&
        Array.isArray(value.projects) &&
        value.projects.every(isProject) &&
        Array.isArray(value.upcoming) && value.upcoming.every(isExperience);
}

function createText(
    tag: "h3" | "p" | "span",
    content: string,
    className?: string
): HTMLElement {
    const element = document.createElement(tag);
    element.textContent = content;

    if (className) {
        element.className = className;
    }

    return element;
}

function renderExperiences(
    items: Experience[],
    container: HTMLElement
): void {
    for (const experience of items) {
        const card = document.createElement("article");
        card.className = "media-card";

        card.append(
            createText("p", experience.period, "card-label"),
            createText("h3", experience.title),
            createText("p", experience.organization, "card-meta"),
            createText("p", experience.description)
        );

        container.appendChild(card);
    }
}

function renderSkills(
    items: Skill[],
    container: HTMLElement
): void {
    for (const skill of items) {
        const card = document.createElement("article");
        card.className = "media-card skill-card";

        card.append(
            createText("h3", skill.name),
            createText("p", levelLabels[skill.level], "card-meta"),
            createText("p", skill.description)
        );

        container.appendChild(card);
    }
}

function renderProjects(
    items: Project[],
    container: HTMLElement
): void {
    for (const project of items) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "media-card project-card";
        button.dataset.projectId = project.id;
        button.setAttribute(
            "aria-label",
            `Voir le détail du projet ${project.title}`
        );

        const preview = document.createElement("img");
        preview.src = project.image;
        preview.alt = "";
        preview.loading = "lazy";
        preview.className = "project-preview";
        button.append(
            preview,
            createText("span", project.category, "card-label"),
            createText("h3", project.title),
            createText("span", "Voir le détail →", "card-action")
        );

        container.appendChild(button);
    }
}

const dialog = document.getElementById("project-dialog");
const dialogTitle = document.getElementById("dialog-title");
const dialogDescription = document.getElementById("dialog-description");
const dialogTechnologies = document.getElementById("dialog-technologies");
const dialogLink = document.getElementById("dialog-link");
const closeDialog = document.getElementById("close-dialog");
const projectsList = document.getElementById("projects-list");

function openProject(project: Project): void {
    if (
        !(dialog instanceof HTMLDialogElement) ||
        !(dialogTitle instanceof HTMLElement) ||
        !(dialogDescription instanceof HTMLElement) ||
        !(dialogTechnologies instanceof HTMLUListElement) ||
        !(dialogLink instanceof HTMLAnchorElement)
    ) {
        return;
    }

    dialogTitle.textContent = project.title;
    dialogDescription.textContent = project.description;
    dialogTechnologies.replaceChildren();

    for (const technology of project.technologies) {
        const item = document.createElement("li");
        item.textContent = technology;
        dialogTechnologies.appendChild(item);
    }

    if (project.url) {
        dialogLink.href = project.url;
        dialogLink.hidden = false;
    } else {
        dialogLink.hidden = true;
    }

    const image = document.getElementById("dialog-image");
    const details = document.getElementById("dialog-details");
    if (image instanceof HTMLImageElement) {
        image.src = project.image;
        image.alt = "Aperçu schématique de l’interface du portfolio";
        image.hidden = false;
    }
    if (details instanceof HTMLElement) {
        details.replaceChildren();
        details.appendChild(createText("h3", "Ce que j’ai réalisé"));
        const achievements = document.createElement("ul");
        for (const achievement of project.achievements) {
            const item = document.createElement("li");
            item.textContent = achievement;
            achievements.appendChild(item);
        }
        details.append(achievements, createText("h3", "Le défi"),
            createText("p", project.challenge), createText("h3", "Ce que j’en retiens"),
            createText("p", project.learning));
    }
    dialog.showModal();
}

function setupProjects(projects: Project[]): void {
    if (!(projectsList instanceof HTMLElement)) {
        return;
    }

    projectsList.addEventListener("click", (event: MouseEvent) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const button = event.target.closest("button[data-project-id]");

        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        const project = projects.find(
            (item) => item.id === button.dataset.projectId
        );

        if (project) {
            openProject(project);
        }
    });
}

if (
    dialog instanceof HTMLDialogElement &&
    closeDialog instanceof HTMLButtonElement
) {
    closeDialog.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event: MouseEvent) => {
        const bounds = dialog.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (event.target === dialog && outside) dialog.close();
    });
}

function setupCarousels(): void {
    const controls = document.querySelectorAll<HTMLButtonElement>(
        "button[data-scroll][data-direction]"
    );

    for (const control of controls) {
        control.addEventListener("click", () => {
            const targetId = control.dataset.scroll;
            const direction = Number(control.dataset.direction);
            const carousel = targetId
                ? document.getElementById(targetId)
                : null;

            if (!carousel || !Number.isFinite(direction)) {
                return;
            }

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            carousel.scrollBy({
                left: direction * carousel.clientWidth * 0.8,
                behavior: reduceMotion ? "instant" : "smooth"
            });
        });
    }
}

const contactForm = document.getElementById("contact-form");
const contactFeedback = document.getElementById("contact-feedback");

if (
    contactForm instanceof HTMLFormElement &&
    contactFeedback instanceof HTMLElement
) {
    contactForm.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        contactFeedback.textContent =
            "Merci ! Votre saisie a été validée. Ce formulaire de démonstration n’envoie pas de message.";
        contactForm.reset();
    });
}

function readEmbeddedCv(): unknown {
    const embedded = document.getElementById("cv-data");
    if (embedded instanceof HTMLScriptElement && embedded.textContent) {
        return JSON.parse(embedded.textContent) as unknown;
    }
    throw new Error("Les données du CV sont absentes. Relance npm run build puis actualise la page.");
}

async function readCvData(): Promise<unknown> {
    // Les navigateurs bloquent fetch() sur les fichiers locaux.
    if (window.location.protocol === "file:") {
        return readEmbeddedCv();
    }
    let response: Response;
    try {
        response = await fetch("data/cv.json");
    } catch {
        return readEmbeddedCv();
    }
    if (response.ok === false) {
        return readEmbeddedCv();
    }
    return response.json();
}

async function loadCv(): Promise<void> {
    const rawData: unknown = await readCvData();

    if (!isCvData(rawData)) {
        throw new Error("Le fichier data/cv.json est invalide.");
    }

    const experiencesList = document.getElementById("experiences-list");
    const skillsList = document.getElementById("skills-list");
    const formationsList = document.getElementById("formations-list");
    const projectsContainer = document.getElementById("projects-list");

    if (
        !(experiencesList instanceof HTMLElement) ||
        !(skillsList instanceof HTMLElement) ||
        !(formationsList instanceof HTMLElement) ||
        !(projectsContainer instanceof HTMLElement)
    ) {
        throw new Error("Une section du CV est absente du HTML.");
    }

    renderExperiences(rawData.experiences, experiencesList);
    renderSkills(rawData.skills, skillsList);
    renderExperiences(rawData.formations, formationsList);
    renderProjects(rawData.projects, projectsContainer);
    setupProjects(rawData.projects);
    const upcomingList = document.getElementById("upcoming-list");
    if (upcomingList instanceof HTMLElement) {
        renderExperiences(rawData.upcoming, upcomingList);
    }
}

setupCarousels();

loadCv().catch((error: unknown) => {
    const message = error instanceof Error
        ? error.message
        : "Erreur inconnue lors du chargement du CV.";

    const status = document.createElement("p");
    status.className = "load-error";
    status.textContent = message;
    mainContent?.prepend(status);
});

// Vidéo de fond : lecture muette automatique quand l’accueil est visible.
const heroVideo = document.getElementById("hero-video");
const backgroundToggle = document.getElementById("teaser-toggle");
const heroSection = document.getElementById("accueil");

if (heroVideo instanceof HTMLVideoElement &&
    backgroundToggle instanceof HTMLButtonElement && heroSection instanceof HTMLElement) {
    const video = heroVideo;
    const toggle = backgroundToggle;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pausedByUser = preference.matches;
    let visible = false;
    let request = 0;
    video.muted = true;

    function syncVideo(): void {
        const current = ++request;
        toggle.textContent = pausedByUser ? "Lire le fond" : "Mettre le fond en pause";
        if (visible && document.hidden === false && pausedByUser === false) {
            void video.play().catch(() => {
                if (current === request) {
                    pausedByUser = true;
                    toggle.textContent = "Lire le fond";
                }
            });
        } else {
            video.pause();
        }
    }
    const observer = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        syncVideo();
    });
    observer.observe(heroSection);
    toggle.addEventListener("click", () => {
        pausedByUser = pausedByUser === false;
        syncVideo();
    });
    preference.addEventListener("change", () => {
        pausedByUser = preference.matches;
        syncVideo();
    });
    document.addEventListener("visibilitychange", syncVideo);
    syncVideo();
}


// Retour à la sélection : le profil garde une navigation complète au clavier.
const returnProfile = document.getElementById("return-profile");
if (returnProfile instanceof HTMLButtonElement &&
    profileScreen instanceof HTMLElement && site instanceof HTMLElement &&
    openProfile instanceof HTMLButtonElement) {
    returnProfile.addEventListener("click", () => {
        if (heroVideo instanceof HTMLVideoElement) heroVideo.pause();
        site.hidden = true;
        profileScreen.hidden = false;
        window.scrollTo({ top: 0, behavior: "instant" });
        openProfile.focus();
    });
}
