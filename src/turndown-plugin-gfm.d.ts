declare module 'turndown-plugin-gfm' {
  import TurndownService from 'turndown';
  export function gfm(turndown: TurndownService): void;

  export default gfm;
}
