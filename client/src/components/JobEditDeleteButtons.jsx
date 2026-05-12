import { MdEdit, MdDelete } from "react-icons/md";
import { iconButtonStyle, iconButtonHoverStyle } from "./jobConstants";

function JobEditDeleteButtons({ onDelete, onEdit, colorEdit = "var(--button-bg)", colorDelete = "#ef4444", fontSize = 24 }) {
  return (
    <>
      <button
        style={{
          ...iconButtonStyle,
          color: colorEdit,
          fontSize,
        }}
        onClick={onEdit}
        title="Edit"
        aria-label="Edit job"
        tabIndex={0}
        onMouseEnter={e => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, iconButtonStyle)}
      >
        <MdEdit />
      </button>
      <button
        style={{
          ...iconButtonStyle,
          color: colorDelete,
          fontSize,
        }}
        onClick={onDelete}
        title="Delete"
        aria-label="Delete job"
        tabIndex={0}
        onMouseEnter={e => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, iconButtonStyle)}
      >
        <MdDelete />
      </button>
    </>
  );
}

export default JobEditDeleteButtons;
