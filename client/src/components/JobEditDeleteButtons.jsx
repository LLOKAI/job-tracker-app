import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { iconButtonStyle, iconButtonHoverStyle } from "./jobConstants";

function JobEditDeleteButtons({ jobId, onDelete, onEdit, colorEdit = "var(--button-bg)", colorDelete = "#ef4444", fontSize = 24 }) {
  return (
    <>
      <Link
        to={`/jobs/${jobId}/edit`}
        style={{
          ...iconButtonStyle,
          color: colorEdit,
          fontSize,
        }}
        title="Edit"
        tabIndex={0}
        onClick={onEdit}
        onMouseEnter={e => Object.assign(e.currentTarget.style, iconButtonHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, iconButtonStyle)}
      >
        <MdEdit />
      </Link>
      <button
        style={{
          ...iconButtonStyle,
          color: colorDelete,
          fontSize,
        }}
        onClick={onDelete}
        title="Delete"
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