// ===== FILAMENT DATA =====
const filamentData = {
    pla: {
        name: 'PLA',
        price: 20,
        strength: 70,
        flexibility: 40,
        ease: 95,
        heat: 50,
        features: [
            '✓ Prototypes',
            '✓ General purpose',
            '✓ Decorative items',
            '✓ Beginners'
        ],
        description: 'Best for beginners and general purpose printing'
    },
    abs: {
        name: 'ABS',
        price: 25,
        strength: 85,
        flexibility: 60,
        ease: 65,
        heat: 80,
        features: [
            '✓ Functional parts',
            '✓ Heat resistance',
            '✓ Durable items',
            '✓ Automotive'
        ],
        description: 'Strong and heat-resistant for functional parts'
    },
    petg: {
        name: 'PETG',
        price: 30,
        strength: 90,
        flexibility: 70,
        ease: 75,
        heat: 75,
        features: [
            '✓ Food safe',
            '✓ Strong & flexible',
            '✓ Weather resistant',
            '✓ Outdoor use'
        ],
        description: 'Best balance of strength and printability'
    },
    tpu: {
        name: 'TPU',
        price: 40,
        strength: 60,
        flexibility: 95,
        ease: 55,
        heat: 60,
        features: [
            '✓ Flexible parts',
            '✓ Phone cases',
            '✓ Gaskets',
            '✓ Wearables'
        ],
        description: 'Highly flexible for elastic applications'
    },
    nylon: {
        name: 'Nylon',
        price: 45,
        strength: 95,
        flexibility: 80,
        ease: 50,
        heat: 85,
        features: [
            '✓ Industrial parts',
            '✓ High strength',
            '✓ Wear resistant',
            '✓ Gears & hinges'
        ],
        description: 'Industrial-grade material for demanding applications'
    },
    wood: {
        name: 'Wood Fill',
        price: 35,
        strength: 65,
        flexibility: 45,
        ease: 70,
        heat: 55,
        features: [
            '✓ Aesthetic finish',
            '✓ Wood texture',
            '✓ Art & decor',
            '✓ Unique look'
        ],
        description: 'Beautiful wood-like finish for decorative items'
    },
    metal: {
        name: 'Metal Fill',
        price: 50,
        strength: 80,
        flexibility: 50,
        ease: 60,
        heat: 70,
        features: [
            '✓ Metal appearance',
            '✓ Heavy weight',
            '✓ Premium finish',
            '✓ Collectibles'
        ],
        description: 'Premium metallic finish for high-end projects'
    }
};

// ===== INFILL SLIDER =====
const infillSlider = document.getElementById('infillPercent');
const infillValue = document.getElementById('infillValue');

if (infillSlider && infillValue) {
    infillSlider.addEventListener('input', function() {
        infillValue.textContent = this.value;
    });
}

// ===== COST CALCULATION =====
function calculateCost() {
    // Get input values
    const volume = parseFloat(document.getElementById('printVolume').value) || 0;
    const infill = parseFloat(document.getElementById('infillPercent').value) || 20;
    const filamentType = document.getElementById('filamentType').value;
    const printTime = parseFloat(document.getElementById('printTime').value) || 0;
    const supportPercent = parseFloat(document.getElementById('supportMaterial').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    // Get filament price
    const filamentPrice = parseFloat(document.getElementById('filamentType').selectedOptions[0].getAttribute('data-price'));

    // Constants
    const MATERIAL_DENSITY = 1.24; // g/cm³ for PLA (average)
    const MACHINE_COST_PER_HOUR = 5; // $5/hour
    const LABOR_COST_PER_HOUR = 10; // $10/hour
    const LABOR_HOURS = 0.5; // Fixed labor time

    // Calculate material weight
    const actualVolume = volume * (infill / 100);
    const supportVolume = volume * (supportPercent / 100);
    const totalVolume = actualVolume + supportVolume;
    const materialWeight = totalVolume * MATERIAL_DENSITY / 1000; // kg
    const materialCost = materialWeight * filamentPrice;

    // Calculate machine cost
    const machineCost = printTime * MACHINE_COST_PER_HOUR;

    // Calculate labor cost
    const laborCost = LABOR_HOURS * LABOR_COST_PER_HOUR;

    // Calculate support cost
    const supportCost = supportVolume * MATERIAL_DENSITY * filamentPrice / 1000;

    // Total cost per unit
    const totalPerUnit = materialCost + machineCost + laborCost + supportCost;

    // Apply bulk discount
    let discount = 0;
    if (quantity >= 10) {
        discount = 0.20; // 20% off
    } else if (quantity >= 5) {
        discount = 0.10; // 10% off
    }

    const totalCost = totalPerUnit * quantity * (1 - discount);
    const savings = totalPerUnit * quantity * discount;

    // Animate and display results
    displayResults({
        totalCost: totalCost,
        materialCost: materialCost,
        machineCost: machineCost,
        laborCost: laborCost,
        supportCost: supportCost,
        perUnitCost: totalPerUnit * (1 - discount),
        savings: savings,
        hasDiscount: discount > 0
    });

    // Create success toast
    createToast('✅ Cost calculated successfully!');
}

// ===== DISPLAY RESULTS =====
function displayResults(results) {
    // Animate total cost
    const totalCostEl = document.getElementById('totalCost');
    animateValue(totalCostEl, 0, results.totalCost, 1000, '$');

    // Update breakdown
    document.getElementById('materialCost').textContent = `$${results.materialCost.toFixed(2)}`;
    document.getElementById('machineCost').textContent = `$${results.machineCost.toFixed(2)}`;
    document.getElementById('laborCost').textContent = `$${results.laborCost.toFixed(2)}`;
    document.getElementById('supportCost').textContent = `$${results.supportCost.toFixed(2)}`;
    document.getElementById('perUnitCost').textContent = `$${results.perUnitCost.toFixed(2)}`;

    // Animate progress bar
    const progressFill = document.getElementById('progressFill');
    setTimeout(() => {
        progressFill.style.width = '100%';
    }, 100);

    // Show savings badge if applicable
    const savingsBadge = document.getElementById('savingsBadge');
    if (results.hasDiscount) {
        document.getElementById('savingsAmount').textContent = `$${results.savings.toFixed(2)}`;
        savingsBadge.style.display = 'flex';
    } else {
        savingsBadge.style.display = 'none';
    }

    // Scroll to results
    document.querySelector('.results-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== ANIMATE VALUE =====
function animateValue(element, start, end, duration, prefix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuad = progress * (2 - progress);
        const current = start + (end - start) * easeOutQuad;
        
        element.textContent = prefix + current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== COMPARISON TOOL =====
function updateComparison() {
    const filament1 = document.getElementById('compare1').value;
    const filament2 = document.getElementById('compare2').value;

    const data1 = filamentData[filament1];
    const data2 = filamentData[filament2];

    // Update card 1
    updateComparisonCard('1', data1);
    
    // Update card 2
    updateComparisonCard('2', data2);

    // Determine winner
    updateWinner(data1, data2);

    // Add animation
    const cards = document.querySelectorAll('.comparison-card');
    cards.forEach(card => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease';
        }, 10);
    });
}

function updateComparisonCard(cardNum, data) {
    document.getElementById(`name${cardNum}`).textContent = data.name;
    document.getElementById(`price${cardNum}`).textContent = `$${data.price}/kg`;
    
    // Update stats with animation
    setTimeout(() => {
        document.getElementById(`strength${cardNum}`).style.width = `${data.strength}%`;
        document.getElementById(`flexibility${cardNum}`).style.width = `${data.flexibility}%`;
        document.getElementById(`ease${cardNum}`).style.width = `${data.ease}%`;
        document.getElementById(`heat${cardNum}`).style.width = `${data.heat}%`;
    }, 100);

    // Update stat values
    document.querySelectorAll(`#card${cardNum} .stat-value`).forEach((el, index) => {
        const values = [data.strength, data.flexibility, data.ease, data.heat];
        el.textContent = `${values[index]}%`;
    });

    // Update features
    const featuresList = document.getElementById(`features${cardNum}`);
    featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
}

function updateWinner(data1, data2) {
    const winnerText = document.getElementById('winnerText');
    
    // Calculate overall score
    const score1 = (data1.strength + data1.flexibility + data1.ease + data1.heat) / 4 - (data1.price * 0.5);
    const score2 = (data2.strength + data2.flexibility + data2.ease + data2.heat) / 4 - (data2.price * 0.5);

    if (score1 > score2) {
        winnerText.textContent = `${data1.name} offers better overall value - ${data1.description}`;
    } else if (score2 > score1) {
        winnerText.textContent = `${data2.name} offers better overall value - ${data2.description}`;
    } else {
        winnerText.textContent = `Both materials are equally matched for different purposes!`;
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize comparison on page load
    if (document.getElementById('compare1')) {
        updateComparison();
    }

    // Add stagger animation to input groups
    const inputGroups = document.querySelectorAll('.input-group');
    inputGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });

    // Add entrance animation to tip cards
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
});

// ===== TOAST NOTIFICATION =====
function createToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

console.log('🧮 Calculator loaded successfully!');

