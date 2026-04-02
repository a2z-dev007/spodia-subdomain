export const profileSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "0.5rem", // rounded-md
    borderColor: state.isFocused ? "#FF9530" : "#d1d5db", // orange on focus else gray-300
    boxShadow: state.isFocused ? "0 0 0 1px #FF9530" : "none",
    padding: "2px 4px",
    background: "#ffffff",
    color: "#374151",
    minHeight: "48px", // match input height (h-12)
    "&:hover": {
      borderColor: "#FF9530",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "0 8px",
  }),
  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "#374151",
    fontSize: "14px"
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#374151",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? "#FF9530" 
      : state.isFocused 
        ? "#FFF7ED" 
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#374151",
    "&:hover": {
      backgroundColor: state.isSelected ? "#FF9530" : "#FFF7ED",
    },
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};