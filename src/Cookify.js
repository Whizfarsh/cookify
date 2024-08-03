import { useEffect, useState } from "react";
import RecipeSummary from "./RecipeSummary";

// Global functions and Variables
const API_key = "c6414a7b8638405386aee74a1cee23e2";
const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1) + ", ";
};
// ------

export default function Cookify() {
	const [isUser, setIsUser] = useState("");
	const [isLoggedin, setIsLoggedIn] = useState(false);

	const [recipes, setRecipes] = useState([]);
	const [selectedId, setSelectedId] = useState(null);

	const [searchQuery, setSearchQuery] = useState("");

	useEffect(function () {
		async function getData() {
			const res = await fetch(
				`https://api.spoonacular.com/recipes/random?apiKey=${API_key}&number=32&include-tags="whole30"`
			);
			const data = await res.json();
			setRecipes(data.recipes);
		}
		getData();
	}, []);
	// console.log(recipes);

	// useeffect for search
	useEffect(
		function () {
			// console.log(searchQuery);
			try {
				async function getData() {
					const res = await fetch(
						`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_key}&ingredients=${searchQuery}&number=30`
					);
					const data = await res.json();
					console.log(data);
					setRecipes(data);
				}
				getData();
			} catch (err) {}
		},
		[searchQuery]
	);
	// -----------------------

	function handleIdSelection(id) {
		setSelectedId(id === selectedId ? "" : id);
	}

	// USER LOGIN FUNCTIONS
	function handleUser(e) {
		e.preventDefault();

		setIsLoggedIn(true);
		// setIsUser(e.target.value);
		// console.log(isUser);
	}

	function handleUserOnChange(e) {
		setIsUser(e.target.value);
		// console.log(e.target.value);
	}
	// ------------------

	//RECIPE SEARCH FUNCTIONS
	function handleSearch(e) {
		e.preventDefault();
	}
	function handleSearchInput(e) {
		const inputValue = e.target.value;

		if (inputValue.length < 3) return;

		setSearchQuery(inputValue);
	}
	// ---------------------
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
							<FormInput
								placeholderText={"Search here..."}
								size={0.7}
								onHandleSubmit={handleSearch}
								onHandleChange={handleSearchInput}
							/>
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
						onValue={isUser}
						onHandleSubmit={handleUser}
						onHandleChange={handleUserOnChange}
						// setIsLoggedIn={setIsLoggedIn}
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
	textTransform = "Capitalize",
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
		textTransform: textTransform,
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
	onValue,
	onHandleSubmit,
	onHandleChange,
}) {
	return (
		<form onSubmit={onHandleSubmit}>
			<input
				style={{ width: `${size * 33}rem`, height: `${size * 3}rem` }}
				className="form-input"
				type="text"
				value={onValue}
				onChange={onHandleChange}
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
