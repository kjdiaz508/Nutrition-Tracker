import { css } from "lit";

const styles = css`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }

  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }
  
  svg.icon,
  svg.icon-no-fill {
    display: inline;
    height: 2em;
    width: 2em;
    vertical-align: top;
  }
  svg.icon {
    fill: currentColor;
  }
`;

export default { styles };
