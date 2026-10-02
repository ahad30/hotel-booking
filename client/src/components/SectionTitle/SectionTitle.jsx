
import { BsSignIntersectionFill } from "react-icons/bs";
const SectionTitle = ({ title, subTitle }) => {
    return (
        <div>
            {
                <div className="my-2 flex justify-start items-center">
                    <div className="flex items-center gap-2">
{/* 
                        <span><BsSignIntersectionFill className="text-xl text-[#24354C]" /></span> */}

                        <h1 className="text-[14px] lg:text-xl font-bold uppercase">{title}</h1>
                    </div>
                    <h5 className="text-base">{subTitle}</h5>
                </div>
            }
        </div>
    );
};

export default SectionTitle;