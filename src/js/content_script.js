var ruleSet;

chrome.storage.sync.get(null, function(data) {
    if (typeof data.rules === 'undefined') {
        chrome.storage.sync.set({
            rules: []
        });

        ruleSet = [];
    } else {
        ruleSet = data.rules;
    }

    if (typeof data.regexStatus === 'undefined') {
        chrome.storage.sync.set({
            regexStatus: 1
        });
        walk(document.body);
    } else {
        if (parseInt(data.regexStatus)) {
            walk(document.body);
        }
    }
});

function walk(node) {
    // I stole this function from here:
    // http://is.gd/mwZp7E
    var child, next;

    switch (node.nodeType) {
        case 1:
        // Element
        case 9:
        // Document
        case 11:
            // Document fragment
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;

        case 3:
            // Text node
            handleText(node);
            break;
    }
}

function handleText(textNode) {
    var v = textNode.nodeValue;
    var regex;

    for (var i = 0; i < ruleSet.length; i++) {
        var rule = ruleSet[i];

        // for backwards compatibility
        if (rule.flags == undefined) {
            rule.flags = 'g';
        }

        regex = new RegExp(rule.searchString, rule.flags);
        if (v.match(regex)) {
            v = v.replace(regex, rule.replaceString);
        }
        textNode.nodeValue = v;
    }
}
