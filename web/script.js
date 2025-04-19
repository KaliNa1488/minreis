document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const suggestions = document.querySelector('.suggestions');

    // Sample dataset of destinations (you can replace this with an API call later)
    const destinations = [
        { name: 'Europe', type: 'continent' },
        { name: 'Asia', type: 'continent' },
        { name: 'North America', type: 'continent' },
        { name: 'South America', type: 'continent' },
        { name: 'Africa', type: 'continent' },
        { name: 'Oceania', type: 'continent' },
        { name: 'Antarctica', type: 'continent' },
        { name: 'France', type: 'country' },
        { name: 'Japan', type: 'country' },
        { name: 'United States', type: 'country' },
        { name: 'Brazil', type: 'country' },
        { name: 'South Africa', type: 'country' },
        { name: 'Australia', type: 'country' },
        { name: 'Paris', type: 'city' },
        { name: 'Tokyo', type: 'city' },
        { name: 'New York', type: 'city' },
        { name: 'Rio de Janeiro', type: 'city' },
        { name: 'Cape Town', type: 'city' },
        { name: 'Sydney', type: 'city' },
        { name: 'Mediterranean', type: 'region' },
        { name: 'Southeast Asia', type: 'region' },
        { name: 'Caribbean', type: 'region' },
        { name: 'Amazon', type: 'region' },
        { name: 'Sahara', type: 'region' },
        { name: 'Great Barrier Reef', type: 'region' }
    ];

    let currentSelection = null;
    let currentHighlightedIndex = -1;
    let filteredDestinations = [];

    function createSuggestionElement(destination, index) {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <span class="destination-name">${destination.name}</span>
            <span class="destination-type">${destination.type}</span>
        `;
        div.addEventListener('click', () => {
            selectDestination(destination);
        });
        if (index === currentHighlightedIndex) {
            div.classList.add('highlighted');
        }
        return div;
    }

    function selectDestination(destination) {
        currentSelection = destination;
        searchInput.value = destination.name;
        suggestions.style.display = 'none';
        currentHighlightedIndex = -1;
    }

    function filterDestinations(query) {
        return destinations.filter(destination => 
            destination.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    function updateSuggestions(query) {
        suggestions.innerHTML = '';
        if (query.length === 0) {
            suggestions.style.display = 'none';
            currentHighlightedIndex = -1;
            return;
        }

        filteredDestinations = filterDestinations(query);
        if (filteredDestinations.length > 0) {
            // Auto-select the first suggestion
            currentHighlightedIndex = 0;
            currentSelection = filteredDestinations[0];

            filteredDestinations.forEach((destination, index) => {
                suggestions.appendChild(createSuggestionElement(destination, index));
            });
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
            currentHighlightedIndex = -1;
            currentSelection = null;
        }
    }

    function navigateToDestination() {
        if (currentSelection) {
            const params = new URLSearchParams({
                destination: currentSelection.name,
                type: currentSelection.type
            });
            window.location.href = `destination.html?${params.toString()}`;
        }
    }

    function moveHighlight(direction) {
        if (filteredDestinations.length === 0) return;

        currentHighlightedIndex += direction;
        
        // Wrap around if needed
        if (currentHighlightedIndex < 0) {
            currentHighlightedIndex = filteredDestinations.length - 1;
        } else if (currentHighlightedIndex >= filteredDestinations.length) {
            currentHighlightedIndex = 0;
        }

        currentSelection = filteredDestinations[currentHighlightedIndex];
        searchInput.value = currentSelection.name;

        // Update highlight in UI
        const items = suggestions.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            if (index === currentHighlightedIndex) {
                item.classList.add('highlighted');
            } else {
                item.classList.remove('highlighted');
            }
        });
    }

    searchInput.addEventListener('input', (e) => {
        currentSelection = null;
        updateSuggestions(e.target.value.trim());
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            navigateToDestination();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveHighlight(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveHighlight(-1);
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
            currentHighlightedIndex = -1;
        }
    });
}); 