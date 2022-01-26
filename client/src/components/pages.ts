export enum Pages {
    main = "main",
    intro = "intro",
    play = "play",
}
export interface PageInput {
    changePage: React.Dispatch<React.SetStateAction<Pages>>
}