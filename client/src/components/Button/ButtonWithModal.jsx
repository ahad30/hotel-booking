
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../redux/Modal/ModalSlice";
import { AiFillFastBackward, AiFillPlusSquare } from "react-icons/ai";
const ButtonWithModal = ({
  title,
  path,
  back
}) => {
 


  const dispatch = useAppDispatch();
  return path ? (
    <Link to={`${path}`}>
      <button className="bg-[#24354C] flex justify-center items-center gap-2  text-center text-white w-full px-2 lg:px-0 py-2 lg:py-0 lg:w-[200px] lg:h-[45px] rounded-md">
        
      {
     back ? (
    <>
      <AiFillFastBackward /> {title}
    </>
  ) : (
    <>
      <AiFillPlusSquare /> {title}
    </>
  )
}

      </button>
    </Link>
  ) : (
    <button
      onClick={() => dispatch(setIsAddModalOpen())}
      className="bg-[#24354C] flex justify-center  items-center gap-2  text-center text-white w-full px-2 lg:px-0 py-2 lg:py-0 lg:w-[200px] lg:h-[45px] rounded-md"
    >
      < AiFillPlusSquare/> {title}
    </button>
  );
};

export default ButtonWithModal;
