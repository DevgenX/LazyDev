const ModelSelect = ({ model, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <select
      className="h-[40px] w-[140px] rounded-md"
      value={model}
      onChange={handleChange}
    >
      <option value="gpt-3.5-turbo">GPT-3.5</option>
      <option value="gpt-4">GPT-4</option>
    </select>
  );
};

export default ModelSelect;
