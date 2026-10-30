
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import './index.css';
// import AISlowDown from './pages/AISlowDown.jsx';
// import App from './App.jsx';
import Header from "../components/Header.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AISlowDown />
  </StrictMode>,
)

function AISlowDown() {
  return (
    <>
      <Header />
      <h1 className="story_title">A story about the Gringotts goblins from Harry Potter. </h1>
      <p id="story_disclaimer">Disclaimer: This story is entirely non-canon and was written by an AI!</p>
      <div className="text_box">
        <p>In the dimly lit corridors of Gringotts Wizarding Bank, the goblins busied themselves with their daily tasks. They were the backbone of the bank, and their work was as intricate as it was crucial. </p>
        <p>Grimbul, a gruff but lovable goblin, oversaw the sorting of gold and precious gems. His bright red beard and bushy eyebrows made him a familiar figure in the bank's labyrinthine tunnels. He took great pride in his work, meticulously sorting the treasure into neat piles, each one containing a different type of gold. </p>
        <p>As he worked, Grimbul's thoughts turned to his family. His wife, Fannibag, and their three children, Grizelda, Gizmo, and Gristle, lived in the goblin village on the outskirts of Diagon Alley. They were always eager to hear about his latest adventures at the bank, and Grimbul made sure to share plenty of stories about his mischievous nephews, who loved to play pranks on their uncle. </p>
        <p>Meanwhile, in the bank's vaults, Rowan, a brilliant goblin engineer, was hard at work on a new project. He was designing a state-of-the-art, magical lock that would ensure the safety of the bank's most valuable treasures. Rowan's mind was a whirlwind of ideas, as he poured over ancient spells and diagrams, seeking to perfect his creation. </p>
        <p>One day, a young wizard named Marcus arrived at the bank, seeking assistance with a problem. His wand was acting erratically, and he was struggling to control his magic. The bank's resident goblin, Binx, took Marcus under his wing, offering guidance and advice. Binx, a skilled goblin wizard himself, had a talent for helping those in need, and he was always happy to lend a helping hand. </p>
        <p>As Marcus worked on his wand, he noticed a strange glow emanating from a nearby storage room. Curious, he pushed open the door and found himself face to face with a mysterious, ancient tome. The book was bound in a strange, glowing material, and its pages seemed to shift and writhe like living serpents. </p>
        <p>"What is this?" Marcus asked, his eyes widening in wonder. </p>
        <p>"It's an old Grindelwald text," Binx explained. "It's said to hold the secrets of the ancient magic that once flowed through this world. But be careful, Marcus - the magic within is powerful, and it's not for the faint of heart." </p>
        <p>Marcus nodded, his mind racing with the possibilities. He decided to seek out the wisdom of the bank's resident goblin elder, a wise and powerful creature named Glimble. Glimble, a respected member of the goblin community, had spent his life studying the ancient arts and was said to possess knowledge beyond the understanding of mortal wizards. </p>
        <p>As Marcus waited for Glimble's response, he couldn't help but wonder what secrets the mysterious tome held. He felt a thrill of excitement, knowing that he was on the verge of unlocking a long-lost mystery. </p>
        <p>In the days that followed, Marcus became increasingly obsessed with the book. He spent hours poring over its pages, trying to decipher the cryptic symbols and spells. But as he delved deeper into the text, he began to realize that the book was not just a simple tome - it was a key, a key to unlocking a hidden world of magic and wonder. </p>
        <p>The goblins at Gringotts Wizarding Bank were beginning to notice a change in Marcus. His obsession with the book had become all-consuming, and he was starting to neglect his duties at the bank. Grimbul and Rowan grew concerned, knowing that Marcus's behavior was erratic and unpredictable. </p>
        <p>But Binx, sensing Marcus's fascination with the book, decided to take matters into his own hands. He began to secretly meet with Marcus, sharing whispers of ancient magic and forbidden knowledge. Slowly but surely, Marcus's obsession began to wane, replaced by a newfound appreciation for the world of magic that lay just beyond the bank's vaults. </p>
        <p>As the mysteries of the book deepened, the goblins at Gringotts Wizarding Bank sensed that something was amiss. The bank's usual sense of security was beginning to falter, and it was clear that a new, powerful force was stirring in the shadows. </p>
        <p>The fate of the bank, and the wizarding world, hung in the balance, as the goblins of Gringotts Wizarding Bank struggled to navigate the treacherous waters of magic and mystery.</p>
      </div>
    </>
  );
}
