const result = document.getElementById('result-btn');
const checkBtn = document.getElementById('check-btn');
const resetBtn = document.getElementById('reset-btn');
const check = document.getElementById('correct-answers-table');

const correctAnswers = {
    "blue-a": "no change",
    "red-a": "no change",
    "type-a": "Neutral",
    "blue-b": "turns red",
    "red-b": "no change",
    "type-b": "Acidic",
    "blue-c": "turns red",
    "red-c": "no change",
    "type-c": "Acidic",
    "blue-d": "no change",
    "red-d": "no change",
    "type-d": "Alkaline",
    "blue-e": "no change",
    "red-e": "turns blue",
    "type-e": "Alkaline",
    "blue-f": "no change",
    "red-f": "turns blue",
    "type-f": "Alkaline",
    "blue-g": "turns red",
    "red-g": "no change",
    "type-g": "Acidic",
};

const litmusPapers = document.querySelectorAll('.papers .redlitmus, .papers .bluelitmus');
const beakers = document.querySelectorAll('.beaker');
let draggedItem = null;
let originalPosition = null;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); // Check if the user is on a mobile device

// Add event listeners for both touch and mouse events
litmusPapers.forEach(paper => {
    const handleTouchStart = (event) => {
        event.preventDefault(); // Prevent default behavior (copying the image)
        
        draggedItem = paper;
        originalPosition = { x: paper.offsetLeft, y: paper.offsetTop }; // Save original position

        setTimeout(() => {
            paper.style.opacity = '0'; // Make it disappear temporarily while dragging
        }, 0);
    };

    const handleTouchMove = (event) => {
        event.preventDefault();  // Prevent page scroll or any other default behavior
        
        const touch = event.touches[0];  // Get the first touch point
        if (draggedItem) {
            draggedItem.style.position = 'absolute';
            draggedItem.style.left = `${touch.pageX - draggedItem.offsetWidth / 2}px`;
            draggedItem.style.top = `${touch.pageY - draggedItem.offsetHeight / 2}px`;
        }
    };

    const handleTouchEnd = () => {
        if (!draggedItem) return;

        // Handle the drop behavior
        draggedItem.style.opacity = '1'; // Restore visibility when dragging ends
        
        let droppedInBeaker = false;

        beakers.forEach(beaker => {
            const beakerRect = beaker.getBoundingClientRect();
            const paperRect = draggedItem.getBoundingClientRect();

            // Check if the dragged item is within the beaker's bounds
            if (paperRect.left > beakerRect.left && paperRect.right < beakerRect.right && paperRect.top > beakerRect.top && paperRect.bottom < beakerRect.bottom) {
                droppedInBeaker = true;
                
                const type = beaker.dataset.type; // Beaker type (acidic, alkaline, neutral)
                const beakerId = beaker.dataset.id.toLowerCase(); // Beaker ID
                const draggedImg = draggedItem.querySelector('img');
                const originalImageSrc = draggedImg.src;
                let newImageSrc = originalImageSrc;

                // Change image source based on conditions
                if (draggedImg.src.includes('Red_Litmus.png') && type === 'acidic' && beakerId === 'g') {
                    newImageSrc = './images/Blue_to_red_Litmus.png';
                } else if (draggedImg.src.includes('Blue_litmus.png') && type === 'acidic' && beakerId === 'g') {
                    newImageSrc = './images/Blue_to_red_Litmus.png'; // Change this line to turn blue litmus red in acid beaker with ID 'g'
                } else if (draggedImg.src.includes('Blue_litmus.png') && type === 'acidic') {
                    newImageSrc = './images/Blue_to_pink_Litmus.png';
                } else if (draggedImg.src.includes('Red_Litmus.png') && type === 'alkaline') {
                    newImageSrc = './images/Red_to_blue_Litmus.png';
                }

                // Change image source
                draggedImg.src = newImageSrc;
            }
        });

        // If it wasn't dropped on a valid beaker, reset the position
        if (!droppedInBeaker) {
            setTimeout(() => {
                draggedItem.style.left = `${originalPosition.x}px`;
                draggedItem.style.top = `${originalPosition.y}px`;
            }, 300);
        }

        draggedItem = null;
    };

    const handleDragStart = (event) => {
        if (isMobile) return; // Skip drag for mobile

        draggedItem = paper;
        originalPosition = { x: paper.offsetLeft, y: paper.offsetTop }; // Save original position
        setTimeout(() => {
            paper.style.opacity = '0'; // Make it disappear temporarily while dragging
        }, 0);
    };

    const handleDragEnd = () => {
        if (isMobile) return; // Skip drag end for mobile

        paper.style.opacity = '1'; // Restore visibility when drag ends
        draggedItem = null;
    };

    if (isMobile) {
        // Mobile-specific touch events for dragging
        paper.addEventListener('touchstart', handleTouchStart);
        paper.addEventListener('touchmove', handleTouchMove);
        paper.addEventListener('touchend', handleTouchEnd);
    } else {
        // Desktop-specific mouse events for dragging
        paper.addEventListener('dragstart', handleDragStart);
        paper.addEventListener('dragend', handleDragEnd);
    }
});

beakers.forEach(beaker => {
    const handleDrop = () => {
        const type = beaker.dataset.type; // Beaker type (acidic, alkaline, neutral)
        const beakerId = beaker.dataset.id.toLowerCase(); // Beaker ID
        const draggedImg = draggedItem.querySelector('img');
        const originalImageSrc = draggedImg.src;
        let newImageSrc = originalImageSrc;

        // Logic to change image source based on conditions
        if (draggedImg.src.includes('Red_Litmus.png') && type === 'acidic' && beakerId === 'g') {
            newImageSrc = './images/Blue_to_red_Litmus.png';
        } else if (draggedImg.src.includes('Blue_litmus.png') && type === 'acidic' && beakerId === 'g') {
            newImageSrc = './images/Blue_to_red_Litmus.png'; // Change this line to turn blue litmus red in acid beaker with ID 'g'
        } else if (draggedImg.src.includes('Blue_litmus.png') && type === 'acidic') {
            newImageSrc = './images/Blue_to_pink_Litmus.png';
        } else if (draggedImg.src.includes('Red_Litmus.png') && type === 'alkaline') {
            newImageSrc = './images/Red_to_blue_Litmus.png';
        }

        // Move the dragged item to the top of the beaker
        const beakerRect = beaker.getBoundingClientRect();
        const containerRect = beaker.closest('.container').getBoundingClientRect();

        draggedItem.style.position = 'absolute';
        draggedItem.style.left = `${beakerRect.left - containerRect.left + beakerRect.width / 2 - draggedItem.offsetWidth / 2}px`;
        draggedItem.style.top = `${beakerRect.top - containerRect.top - draggedItem.offsetHeight / 2}px`;
        draggedImg.src = newImageSrc;

        // Reset the position after 3 seconds
        setTimeout(() => {
            draggedImg.src = originalImageSrc; // Reset image source
            draggedItem.style.position = ''; // Clear absolute positioning
            draggedItem.style.left = ''; // Clear left position
            draggedItem.style.top = ''; // Clear top position
        }, 2000);
    };

    const handleDragOver = (event) => {
        event.preventDefault(); // Allow dropping
    };

    beaker.addEventListener('dragover', handleDragOver);
    beaker.addEventListener('drop', handleDrop);

    // Mobile-specific drop logic (touch event)
    if (isMobile) {
        beaker.addEventListener('touchend', handleDrop);
    }
});
