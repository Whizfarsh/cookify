import { useEffect, useState } from "react";
import { Button } from "./Cookify";

// GLOBAL FUNCTIONS AND VARIABLES
function removeHtmlTags(str) {
	return str.replace(/<\/?[^>]+(>|$)/g, "");
}
// -----------
export default function RecipeSummary({
	capitalizeFirstLetter,
	selectedId,
	setSelectedId,
}) {
	// const [tabActive, setTabActive] = useState(false);
	const [tabName, setTabName] = useState("info");
	const [recipeDetails, setRecipeDetails] = useState([]);

	// console.log(selectedId);
	useEffect(
		function () {
			async function getData() {
				if (selectedId) {
					const res = await fetch(
						`https://api.spoonacular.com/recipes/${selectedId}/information?apiKey=c6414a7b8638405386aee74a1cee23e2&includeNutrition=true`
					);
					const data = await res.json();
					console.log(data);
					setRecipeDetails(data);
				} else {
					console.log("incorrct ID");
				}
			}
			getData();
		},
		[selectedId]
	);

	const reduceTitle = (title) => {
		const titleIndex = title?.indexOf("By");

		if (titleIndex !== -1) {
			return title?.substring(0, titleIndex);
		}
		return title;
	};

	function handleTabName(tabname) {
		setTabName(tabname);
	}
	return (
		<>
			<button
				style={{
					border: "2px solid #a9dcb5",
					borderRadius: "50%",
					marginLeft: "1rem",
					cursor: "pointer",
				}}
				onClick={() => setSelectedId(null)}
			>
				<ion-icon
					style={{ fontSize: "32px", border: "none" }}
					name="arrow-back-outline"
				></ion-icon>
			</button>
			<div className="recipe-summary">
				<div className="RS-mini">
					<div style={{ maxWidth: "100%" }} className="recipe-gallery">
						<img
							style={{ width: "100%" }}
							src={recipeDetails.image}
							alt={recipeDetails.title}
						/>
					</div>
					<div style={{ maxWidth: "100%" }} className="recipe-mini-info">
						<div
							style={{ display: "flex", gap: ".6rem", marginBottom: ".8rem" }}
						>
							<Button
								size={6}
								padding=".7rem"
								height="3rem"
								buttonText="Info"
								tabActive={true}
								className={tabName === "info" ? "btn-active" : ""}
								onClick={() => handleTabName("info")}
							/>
							<Button
								size={10}
								padding="1rem"
								height="3rem"
								buttonText="Ingredients"
								className={tabName === "ingredients" ? "btn-active" : ""}
								onClick={() => handleTabName("ingredients")}
							/>
							<Button
								size={10}
								padding="1rem"
								height="3rem"
								buttonText="Instructions"
								className={tabName === "instruction" ? "btn-active" : ""}
								onClick={() => handleTabName("instruction")}
							/>

							<Button
								size={10}
								padding="1rem"
								height="3rem"
								buttonText="Summary"
								className={tabName === "summary" ? "btn-active" : ""}
								onClick={() => handleTabName("summary")}
							/>
						</div>
						<div className="RS-info-show-details">
							{tabName === "info" && (
								<RecipeMiniInfo
									reduceTitle={reduceTitle}
									capitalizeFirstLetter={capitalizeFirstLetter}
									recipeDetails={recipeDetails}
								/>
							)}
							{tabName === "summary" && (
								<QuickSummary recipeDetails={recipeDetails} />
							)}
							{tabName === "ingredients" && (
								<ShortIngredients recipeDetails={recipeDetails} />
							)}
							{tabName === "instruction" && (
								<FullDetails recipeDetails={recipeDetails} />
							)}
						</div>
					</div>
				</div>
				{/* <div className="RS-full-details">
					<FullDetails recipeDetails={recipeDetails} />
				</div> */}
			</div>
		</>
	);
}

// basic details
function RecipeMiniInfo({ reduceTitle, capitalizeFirstLetter, recipeDetails }) {
	// const getDishTypes = recipeDetails.dishTypes.includes("Breakfast");

	// console.log(getDishTypes);

	return (
		<div>
			<p>
				<span className="RS-info-text">Name: </span>
				<span className="RS-info-description">
					{reduceTitle(recipeDetails.title)},
				</span>
			</p>
			<p>
				<span className="RS-info-text">Dish Type: </span>

				<span className="RS-info-description">
					{recipeDetails.dishTypes
						?.slice(0, 3)
						.map((dishtype) => `${dishtype}, `)}
				</span>
			</p>
			<p>
				<span className="RS-info-text">Cuisines: </span>
				<span className="RS-info-description">
					{recipeDetails.cuisines?.map(
						(cuisine) => capitalizeFirstLetter(cuisine)
						// <span>{diet}</span>
					)}
				</span>
			</p>
			<p>
				<span className="RS-info-text">Occasions: </span>
				<span className="RS-info-description">
					{recipeDetails.occasions?.length > 0
						? recipeDetails.occasions?.map(
								(occasion) => capitalizeFirstLetter(occasion)
								// <span>{diet}</span>
						  )
						: "Not Specific"}
				</span>
			</p>
			<p>
				<span className="RS-info-text">Diets: </span>
				<span className="RS-info-description">
					{recipeDetails.diets?.slice(0, 3).map(
						(diet) => capitalizeFirstLetter(diet)
						// <span>{diet}</span>
					)}
				</span>
			</p>
			<p>
				<span className="RS-info-text">Duration:</span>{" "}
				<span className="RS-info-description">
					{recipeDetails.readyInMinutes} Minutes,{" "}
				</span>
			</p>
			<p>
				<span className="RS-info-text">Serving:</span>{" "}
				<span className="RS-info-description">
					{recipeDetails.servings} people
				</span>
			</p>
		</div>
	);
}

function QuickSummary({ recipeDetails }) {
	return (
		<p style={{ width: "100%", fontSize: "1.2rem" }}>
			{/* <span dangerouslySetInnerHTML={{ __html: recipeDetails.summary }}></span> */}
			{removeHtmlTags(recipeDetails.summary)}
		</p>
	);
}

function ShortIngredients({ recipeDetails }) {
	return (
		<div
			style={{ fontSize: "1.4rem", margin: "0rem", padding: ".5rem 1.8rem" }}
		>
			{
				<ol>
					{recipeDetails.extendedIngredients.map((ingredients) => (
						<li style={{ marginBottom: ".5rem" }} key={ingredients.id}>
							{ingredients.original}
						</li>
					))}
				</ol>
			}
		</div>
	);
}
// ----

// More details
function FullDetails({ recipeDetails }) {
	console.log(recipeDetails);
	// console.log(recipeDetails.analyzedInstructions[0].steps);
	return (
		<>
			<div style={{ width: "100%" }} className="nutritions">
				<p style={{ padding: "1rem", fontSize: "1.4rem" }}>
					{removeHtmlTags(recipeDetails.instructions)}
				</p>
			</div>
		</>
	);
}
