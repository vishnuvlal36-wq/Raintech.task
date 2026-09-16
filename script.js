


// ROOM DATA



const rooms = {

    R101: {
        code: "R101",
        type: "Deluxe Room",
        price: 3500,
        guests: 2,
        bed: "King Bed",
        description:
            "A comfortable and stylish room with modern amenities, perfect for a relaxing stay."
    },

    R102: {
        code: "R102",
        type: "Deluxe Room",
        price: 3500,
        guests: 2,
        bed: "King Bed",
        description:
            "A comfortable and stylish room with modern amenities, perfect for a relaxing stay."
    },

    R201: {
        code: "R201",
        type: "Executive Suite",
        price: 5800,
        guests: 3,
        bed: "King Bed",
        description:
            "Spacious suite with premium furnishings and a great view."
    },

    R202: {
        code: "R202",
        type: "Executive Suite",
        price: 5800,
        guests: 3,
        bed: "King Bed",
        description:
            "Spacious suite with premium furnishings and a great view."
    },

    R301: {
        code: "R301",
        type: "Family Room",
        price: 4200,
        guests: 4,
        bed: "2 Queen Beds",
        description:
            "Ideal for families, with extra space and all the essentials for a comfortable stay."
    }

};




// GET ELEMENTS


const checkInInput =
    document.getElementById("checkIn");

const checkOutInput =
    document.getElementById("checkOut");

const updateDatesButton =
    document.getElementById("updateDates");

const roomCards =
    document.querySelectorAll(".room-card");

const errorMessage =
    document.getElementById("errorMessage");

const dateStatus =
    document.getElementById("dateStatus");

const statusText =
    document.getElementById("statusText");

const nightsText =
    document.getElementById("nightsText");

const selectedRoomElement =
    document.getElementById("selectedRoom");

const summaryCheckIn =
    document.getElementById("summaryCheckIn");

const summaryCheckOut =
    document.getElementById("summaryCheckOut");

const summaryNights =
    document.getElementById("summaryNights");

const summaryNightsPrice =
    document.getElementById("summaryNightsPrice");

const summaryPrice =
    document.getElementById("summaryPrice");

const summaryTotal =
    document.getElementById("summaryTotal");

const proceedButton =
    document.getElementById("proceedBtn");

const summaryNote =
    document.getElementById("summaryNote");





// SELECTED ROOM

let selectedRoom = null;




// TODAY




const today = new Date();

today.setHours(0, 0, 0, 0);

checkInInput.min =
    formatDateForInput(today);





// ROOM SELECTION


roomCards.forEach(function (card) {

    const button =
        card.querySelector(".select-room");


    button.addEventListener("click", function () {

        // Remove previous selection
        roomCards.forEach(function (roomCard) {

            roomCard.classList.remove("selected");

            roomCard.querySelector(
                ".select-room"
            ).textContent = "Select Room";

        });


        // Select current room
        card.classList.add("selected");

        button.textContent = "Selected";


        // Get room data
        const roomCode =
            card.dataset.room;

        selectedRoom =
            rooms[roomCode];


        updateBooking();

    });

});





// CHECK-IN DATE


checkInInput.addEventListener("change", function () {

    clearError();

    const checkInValue =
        checkInInput.value;


    if (checkInValue) {

        checkOutInput.min =
            getNextDate(checkInValue);

    }


    setPendingDateStatus();

});




// CHECK-OUT DATE



checkOutInput.addEventListener("change", function () {

    clearError();

    setPendingDateStatus();

});




// UPDATE DATES BUTTON


updateDatesButton.addEventListener(
    "click",
    function () {

        updateBooking();

    }
);





// MAIN UPDATE FUNCTION




function updateBooking() {

    clearError();


    const checkInValue =
        checkInInput.value;

    const checkOutValue =
        checkOutInput.value;




    // RESET SUMMARY
    

    summaryCheckIn.textContent = "-";

    summaryCheckOut.textContent = "-";

    summaryNights.textContent = "-";

    summaryNightsPrice.textContent = "-";

    summaryPrice.textContent = "-";

    summaryTotal.textContent = "-";

    proceedButton.disabled = true;

    proceedButton.classList.remove("active");


    


    // CHECK DATE INPUTS
    

    if (!checkInValue || !checkOutValue) {

        showError(
            "Please select both check-in and check-out dates."
        );

        setInvalidStatus();

        return;
    }


    const checkInDate =
        parseDate(checkInValue);

    const checkOutDate =
        parseDate(checkOutValue);




    // PAST CHECK-IN
    

    if (checkInDate < today) {

        showError(
            "Check-in date cannot be in the past."
        );

        setInvalidStatus();

        return;
    }


    // --------------------------------------
    // CHECKOUT VALIDATION
    // --------------------------------------

    if (checkOutDate <= checkInDate) {

        showError(
            "Check-out date must be after check-in date."
        );

        setInvalidStatus();

        return;
    }


    

    // CALCULATE NIGHTS
    

    const difference =
        checkOutDate.getTime() -
        checkInDate.getTime();


    const nights =
        Math.round(
            difference /
            (1000 * 60 * 60 * 24)
        );


    


    // UPDATE DATE INFORMATION


    summaryCheckIn.textContent =
        formatDisplayDate(checkInValue);

    summaryCheckOut.textContent =
        formatDisplayDate(checkOutValue);

    summaryNights.textContent =
        nights + (nights === 1 ? " night" : " nights");

    nightsText.textContent =
        nights + (nights === 1 ? " night" : " nights");





    // VALID DATES



    setValidStatus();


    
    // ROOM NOT SELECTED
    

    if (!selectedRoom) {

        summaryNote.textContent =
            "Select a room to see the total price.";

        return;
    }


    // CALCULATE PRICE
    

    const total =
        nights * selectedRoom.price;


    // UPDATE SELECTED ROOM
    

    selectedRoomElement.classList.add("active");


    selectedRoomElement.innerHTML = `

        <span class="selected-room-code">
            ${selectedRoom.code}
        </span>

        <h3>
            ${selectedRoom.type}
        </h3>

        <p>
            ${selectedRoom.description}
        </p>

    `;



    // UPDATE PRICE DETAILS
    
    summaryPrice.textContent =
        formatCurrency(selectedRoom.price);

    summaryNightsPrice.textContent =
        nights + (nights === 1 ? " night" : " nights");

    summaryTotal.textContent =
        formatCurrency(total);


    // --------------------------------------
    // ENABLE PROCEED
    // --------------------------------------

    proceedButton.disabled = false;

    proceedButton.classList.add("active");

    summaryNote.textContent =
        "Price calculated for your selected room and dates.";

}


// ==========================================
// DATE STATUS
// ==========================================

function setValidStatus() {

    dateStatus.classList.remove(
        "invalid",
        "pending"
    );

    statusText.textContent =
        "Valid dates selected";

}


function setInvalidStatus() {

    dateStatus.classList.remove("pending");

    dateStatus.classList.add("invalid");

    statusText.textContent =
        "Invalid dates";

}


function setPendingDateStatus() {

    dateStatus.classList.remove(
        "invalid"
    );

    dateStatus.classList.add(
        "pending"
    );

    statusText.textContent =
        "Update dates to continue";
}



// ERROR


function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.classList.add("show");

}


function clearError() {

    errorMessage.textContent = "";

    errorMessage.classList.remove("show");

}


// DATE PARSER


function parseDate(dateString) {

    const [year, month, day] =
        dateString.split("-").map(Number);


    return new Date(
        year,
        month - 1,
        day
    );

}



// FORMAT DATE FOR INPUT


function formatDateForInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}



// GET NEXT DATE


function getNextDate(dateString) {

    const date =
        parseDate(dateString);

    date.setDate(
        date.getDate() + 1
    );


    return formatDateForInput(date);

}


// ==========================================
// DISPLAY DATE
// ==========================================

function formatDisplayDate(dateString) {

    const date =
        parseDate(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// CURRENCY


function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}