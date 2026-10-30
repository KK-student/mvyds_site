export default function Searchbar() {
  return (
    <>
      <div className="searchbar" onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log("Form data: ", data);
      }}>
        <form>
          <input type="text" name="input" />
          <button type="submit">Search</button>
        </form>
      </div>
    </>
  );
}
