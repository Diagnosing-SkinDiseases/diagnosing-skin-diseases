const ButtonGroup = ({ content, publish }) => {
  return (
    <div className="d-flex justify-content-end">
      <button className="btn btn-primary mx-2">Preview</button>
      <button className="btn btn-primary mx-2">Save</button>
      <button className="btn btn-primary mx-2" onClick={() => publish(content)}>
        Publish
      </button>
    </div>
  );
};

export default ButtonGroup;
