import { ConfigProvider, Select } from "antd";
import { LuCheck, LuChevronDown, LuSearch } from "react-icons/lu";

const theme = {
  token: {
    colorPrimary: "#7c3aed",
    borderRadius: 16,
    fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    colorBorder: "#d5dae2",
    controlHeightLG: 48,
    fontSizeLG: 15,
  },
  components: {
    Select: {
      optionSelectedBg: "#f5f3ff",
      optionSelectedColor: "#5b21b6",
      optionActiveBg: "#f6f7f9",
      optionPadding: "10px 12px",
      optionHeight: 40,
    },
  },
};

// Ant Design Select themed to the site. Loaded lazily by SelectField.
const AntSelect = ({ value, onChange, options, placeholder, disabled, showSearch, bare, ariaLabel, className = "" }) => (
  <ConfigProvider theme={theme}>
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      showSearch={showSearch}
      optionFilterProp="searchText"
      size="large"
      variant={bare ? "borderless" : "outlined"}
      aria-label={ariaLabel}
      className={`w-full ${bare ? "behb-select-bare" : ""} ${className}`}
      popupClassName="behb-select-popup"
      popupMatchSelectWidth={bare ? 240 : true}
      suffixIcon={showSearch ? <LuSearch className="h-4 w-4 text-ink-400" /> : <LuChevronDown className="h-4 w-4 text-ink-400" />}
      menuItemSelectedIcon={<LuCheck className="h-4 w-4 text-brand-600" />}
      notFoundContent={<span className="block px-1 py-2 text-sm text-ink-500">No matches</span>}
      optionRender={(option) => (
        <span className="flex items-center justify-between gap-3">
          <span className="truncate font-medium">{option.data.label}</span>
          {option.data.hint && <span className="shrink-0 text-xs text-ink-400">{option.data.hint}</span>}
        </span>
      )}
    />
  </ConfigProvider>
);

export default AntSelect;
