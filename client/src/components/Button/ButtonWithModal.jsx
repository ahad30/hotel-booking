import { Link } from "react-router-dom";
import { LuArrowLeft, LuPlus } from "react-icons/lu";
import { useAppDispatch } from "../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../redux/Modal/ModalSlice";

// Primary action on dashboard list pages: links to a page, or opens the Add modal.
const ButtonWithModal = ({ title, path, back }) => {
  const dispatch = useAppDispatch();
  const content = (
    <>
      {back ? <LuArrowLeft className="h-4 w-4" /> : <LuPlus className="h-4 w-4" />} {title}
    </>
  );
  const className = back ? "btn-ghost w-full lg:w-auto" : "btn-brand w-full lg:w-auto";

  return path ? (
    <Link to={path} className={className}>
      {content}
    </Link>
  ) : (
    <button onClick={() => dispatch(setIsAddModalOpen())} className={className}>
      {content}
    </button>
  );
};

export default ButtonWithModal;
