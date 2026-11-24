const selectedItems = {};

const buttons = document.querySelectorAll(".item-button");

const totalPriceElement = document.getElementById("totalPrice");

async function updateTotal() {
    const itemIds = Object.values(selectedItems);

    if (itemIds.length === 0) {
        totalPriceElement.textContent = "$0.00";
        return;
    }

    const response = await fetch(
        `/api/outfit-price?items=${itemIds.join(",")}`
    );

    const data = await response.json();

    if (response.ok) {
        totalPriceElement.textContent =
            `$${data.total_price.toFixed(2)}`;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {

        const id = button.dataset.id;
        const category = button.dataset.category;
        const color = button.dataset.color;

        if (selectedItems[category] === id) {
            delete selectedItems[category];
            button.classList.remove("selected");
        } else {

            buttons.forEach(otherButton => {
                if (otherButton.dataset.category === category) {
                    otherButton.classList.remove("selected");
                }
            });

            selectedItems[category] = id;
            button.classList.add("selected");

            const avatarPart = {
                tops: "avatarTop",
                bottoms: "avatarBottom",
                shoes: "avatarShoes"
            };

            document.getElementById(avatarPart[category]).style.backgroundColor =
                color;
        }

        updateTotal();
    });
});

document.querySelectorAll(".skin-option").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("avatarHead").style.backgroundColor =
            button.dataset.color;
    });
});

document.querySelectorAll(".hair-option").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("avatarHair").style.backgroundColor =
            button.dataset.color;
    });
});