const Paragraph = ({ id, onChange }) => {
  return (
    <>
      <div className="my-3" id={id} key={id}>
        <label
          htmlFor="txt1"
          className="d-block form-label create-article-label"
        >
          Paragraph
        </label>
        <textarea
          id="txt1"
          rows="3"
          className="form-control"
          onChange={onChange}
        ></textarea>
      </div>
    </>
  );
};

export default Paragraph;
