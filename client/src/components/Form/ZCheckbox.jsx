
import { Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/Hook/Hook";

const ZCheckbox = ({
  value,
  label,
  name,
  checkedAttributed,
  isSuccess,
  keys,
}) => {
  const { control, resetField } = useFormContext();
  const { isEditModalOpen, isAddModalOpen } = useAppSelector(
    (state) => state.modal
  );

  const [sChecked, setIsChecked] = useState(value); 
  useEffect(() => {
    if (!isAddModalOpen || !isEditModalOpen || isSuccess) {
      setIsChecked(value);
      if (checkedAttributed) {
        resetField(name);
      }
    }
    if (keys === true && (isAddModalOpen || isEditModalOpen)) {
      setIsChecked(true);
    }
  }, [isAddModalOpen, isEditModalOpen, isSuccess, checkedAttributed, keys, value , name , resetField]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (e) => {
          const isChecked = e.target.checked;
          // console.log(isChecked)
          setIsChecked(isChecked);
          field.onChange(isChecked); 
        };
        return (
          <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={sChecked}
              onChange={handleChange}
              {...(checkedAttributed ? { checked: sChecked } : {})}
            >
              {label}
            </Checkbox>
            {error && <small style={{ color: "red", marginLeft: "8px" }}>{error?.message}</small>}
          </div>
        </>
        
        );
      }}
    />
  );
};

export default ZCheckbox;






                   







// "use client"
// import { Checkbox } from "antd";
// import { Controller, useFormContext } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/redux/Hook/Hook";


// const     ZCheckbox = ({
//   value,
//   label,
//   name,
//   checked,
//   checkedAttributed,
//   isSuccess,
//   keys,
// }) => {

//   const { control, resetField ,setValue} = useFormContext();
//   const { isEditModalOpen, isAddModalOpen } = useAppSelector(
//     (state) => state.modal
//   );

//   const [sChecked, setIsChecked] = useState(false);

//   useEffect(() => {
//     if (!isAddModalOpen || !isEditModalOpen || isSuccess) {
//       setIsChecked(false);
//       if (checkedAttributed) {
//         resetField(name);
//       }
//     }
//     if (keys === true && (isAddModalOpen || isEditModalOpen)) {
//       setValue(value); 
//       setIsChecked(true);
//     }
//   }, [isAddModalOpen, isEditModalOpen, isSuccess, checkedAttributed, keys]);

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => {
//         // const handleChange = (e) => {
//         //   sChecked ? setIsChecked(false) : setIsChecked(true);
//         //   const isChecked = e.target.checked;
//         //   console.log(isChecked)
//         //   const currentValue = Array.isArray(field.value) ? field.value : [];
//         //   const newValue = isChecked
//         //     ? [...currentValue, value]
//         //     : currentValue.filter((v) => v !== value);
//         //   field.onChange(newValue);
//         // };
//         const handleChange = (e) => {
//           const isChecked = e.target.checked;
//           // console.log(isChecked)
//           setIsChecked(isChecked);
//           field.onChange(isChecked); 
//         };
//         return (
//           <>
//             <Checkbox
//               defaultChecked={checked ? checked : false}
//               onChange={handleChange}
//               {...(checkedAttributed ? { checked: sChecked } : {})}
//             >
//               {label}
//             </Checkbox>
//             {error && <small style={{ color: "red" }}>{error?.message}</small>}
//           </>
//         );
//       }}
//     />
//   );
// };

// export default ZCheckbox;
