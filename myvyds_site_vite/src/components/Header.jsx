import AISlowDownLink from './AISlowDownLink.jsx';

export default function Header() {
  return (
    <>
      <div className="header">
        <div className="project_title_div"><h1 className="project_title">Myvyds</h1></div>
        <div className="account_actions">
          <button type="submit" className="settings_button">Settings</button>
          <button type="submit" className="login_button" onClick={(e) => {
            e.preventDefault();
            window.location.href = "/login.html";
          }}>Log in</button>
        </div>
      </div>
    </>
  );
};

// export default function NormalPageHeader() {
//   return (
//     <>
//       <Header />
//       <AISlowDownLink />
//     </>
//   );
// }
