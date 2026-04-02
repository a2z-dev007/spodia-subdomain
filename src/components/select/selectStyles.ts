export const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "0.5rem", // rounded-md
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db", // blue-600 on focus else gray-300
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    padding: "2px 4px",
    background:"rgb(255 255 255 / 0.2)",
    color:"#fff",
    minHeight: "44px", // match input height
    "&:hover": {
      borderColor: "#2563eb",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 6px",
  }),
  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
     color:"#fff",
     fontSize:"14px"
  }),
  placeholder: (base: any) => ({
    ...base,
     color:"#fff",
  }),
  singleValue: (base: any) => ({
    ...base,
     color:"#fff",
  }),
};