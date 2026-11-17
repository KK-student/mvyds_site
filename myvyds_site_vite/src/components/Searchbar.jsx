export default function Searchbar({onSubmitFunction}) {
  return (
    <>
      <div className="searchbar" onSubmit={onSubmitFunction}>
        <form>
          <input type="text" name="input" />
          <button type="submit">Search</button>
        </form>
      </div>
    </>
  );
}
