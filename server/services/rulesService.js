const fs = require('fs');
const path = require('path');

const RULES_FILE = path.join(__dirname, '../../data/rules.json');

// Ensure data directory exists
const dataDir = path.dirname(RULES_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initial state
const defaultRules = {
    shield: [], // List of emails/domains to block/trash
    rollup: [], // List of emails/domains to rollup
    whitelist: [] // List of trusted senders
};

/**
 * Load rules from disk
 */
function loadRules() {
    try {
        if (!fs.existsSync(RULES_FILE)) {
            saveRules(defaultRules);
            return defaultRules;
        }
        const data = fs.readFileSync(RULES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading rules:', error);
        return defaultRules;
    }
}

/**
 * Save rules to disk
 */
function saveRules(rules) {
    try {
        fs.writeFileSync(RULES_FILE, JSON.stringify(rules, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving rules:', error);
        return false;
    }
}

/**
 * Add a sender to Shield (Block)
 */
function addToShield(sender) {
    const rules = loadRules();
    if (!rules.shield.includes(sender)) {
        rules.shield.push(sender);
        // Remove from other lists if present
        rules.rollup = rules.rollup.filter(s => s !== sender);
        saveRules(rules);
    }
    return rules;
}

/**
 * Add a sender to Rollup
 */
function addToRollup(sender) {
    const rules = loadRules();
    if (!rules.rollup.includes(sender)) {
        rules.rollup.push(sender);
        // Remove from other lists if present
        rules.shield = rules.shield.filter(s => s !== sender);
        saveRules(rules);
    }
    return rules;
}

/**
 * Remove a sender from all rules
 */
function removeRule(sender) {
    const rules = loadRules();
    rules.shield = rules.shield.filter(s => s !== sender);
    rules.rollup = rules.rollup.filter(s => s !== sender);
    saveRules(rules);
    return rules;
}

module.exports = {
    loadRules,
    addToShield,
    addToRollup,
    removeRule
};
