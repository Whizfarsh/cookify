import { useEffect, useRef, useState } from "react";
import RecipeSummary from "./RecipeSummary";

// Global functions and Variables
const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1) + ", ";
};
// ------

export default function Cookify() {
	const [isUser, setIsUser] = useState("");
	const [isLoggedin, setIsLoggedIn] = useState(false);

	const [recipes, setRecipes] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	// const [isSelected, setIsSelected] = useState(false);

	useEffect(function () {
		async function getData() {
			const res = await fetch(
				`https://api.spoonacular.com/recipes/random?apiKey=c6414a7b8638405386aee74a1cee23e2&number=32&include-tags="whole30"`
			);
			const data = await res.json();
			setRecipes(data.recipes);
		}
		getData();
	}, []);
	// console.log(recipes);

	useEffect(function () {}, []);

	function handleIdSelection(id) {
		setSelectedId(id === selectedId ? "" : id);
		// setIsSelected((s) => !s);
		// console.log(id);
	}
	return (
		<div>
			{isLoggedin ? (
				<MainHome isUser={isUser}>
					<NavSection>
						<Logo size={0.8} />
						<div
							style={{
								display: "flex",
								alignItems: "center",
								columnGap: "1.3rem",
							}}
						>
							<FormInput placeholderText={"Search here..."} size={0.7} />
							<UserGreeting isUser={isUser} />
						</div>
					</NavSection>

					{selectedId ? (
						<RecipeSummary
							capitalizeFirstLetter={capitalizeFirstLetter}
							selectedId={selectedId}
							setSelectedId={setSelectedId}
						/>
					) : (
						<RecipesLists recipes={recipes} onSelectedID={handleIdSelection} />
					)}
				</MainHome>
			) : (
				<HomePage>
					<Logo size={1.4} />

					<FormInput
						placeholderText="Your Name Here..."
						setIsUser={setIsUser}
						isUser={isUser}
						setIsLoggedIn={setIsLoggedIn}
					/>

					{/* <WelcomeUser isUser={isUser} /> */}
				</HomePage>
			)}
		</div>
	);
}

export function Button({
	buttonText,
	className,
	size = 12,
	color = "#000000",
	padding = "1.6rem",
	// width = "6rem",
	height = `4.5rem`,
	onClick,
}) {
	const homeBtnStyle = {
		width: `${size}rem`,
		height: height,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",
		color: color,
		backgroundColor: "none",
		border: "none",
		borderRadius: "1rem",
		padding: padding,
		fontWeight: 700,
		// backg
	};
	// return <button className={className}>{buttonText}</button>;
	return (
		<button style={homeBtnStyle} onClick={onClick} className={className}>
			{buttonText}
		</button>
	);
}
// Header
function NavSection({ children }) {
	return <nav className="nav">{children}</nav>;
}

function Logo({ size }) {
	return (
		<div className="logo">
			<p style={{ fontSize: `${size * 7}rem` }} className="logo-img">
				🍽
			</p>
			<h1 style={{ fontSize: `${size * 3.5}rem` }} className="logo-text">
				Cookify
			</h1>
		</div>
	);
}

function FormInput({
	placeholderText,
	size = 1.2,
	setIsUser,
	isUser,
	setIsLoggedIn,
}) {
	// const userInput = useRef(null);

	function handleUser(e) {
		e.preventDefault();

		setIsLoggedIn(true);
		console.log(isUser);
	}
	return (
		<form onSubmit={handleUser}>
			<input
				style={{ width: `${size * 33}rem`, height: `${size * 3}rem` }}
				className="form-input"
				type="text"
				value={isUser}
				onChange={(e) => setIsUser(e.target.value)}
				// ref={userInput}
				placeholder={placeholderText}
				required
			/>
		</form>
	);
}
// header ends here

// HOME

function UserGreeting({ isUser }) {
	return <p style={{ fontSize: "2.4rem" }}>Welcome, {isUser}</p>;
}

function HomePage({ children }) {
	return <div className="homepage-load">{children}</div>;
}
// Home ends here

// Main Home Page
function MainHome({ children }) {
	return <div style={{ width: "100%" }}>{children}</div>;
}

function RecipesLists({ recipes, onSelectedID }) {
	return (
		<div style={{ width: "100%" }}>
			<h3 style={{ fontSize: "2.8rem", fontWeight: "200" }}>
				Here are some recommended recipes for you, enjoy 😜
			</h3>
			<div>
				<ul className="recipes-lists">
					{recipes.map((recipe) => (
						<Lists
							recipe={recipe}
							key={recipe.id}
							onSelectedID={onSelectedID}
						/>
					))}
				</ul>
			</div>
		</div>
	);
}

function Lists({ recipe, onSelectedID }) {
	return (
		<li className="recipe-list" onClick={() => onSelectedID(recipe.id)}>
			<img style={{ width: "100%" }} src={recipe.image} alt="" />
			<h3>{recipe.title}</h3>
		</li>
	);
}
