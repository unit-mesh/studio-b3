# AI Editor


## Sapling

`Hit the backtick or tab key to use Sapling's completion.`

Translate by ChatGPT

```javascript
function displaySaplingComplete(element, text, options) {
  // Check if the text is not empty
  if (text !== '') {
    // Set default values if options are not provided
    let { query, model_version, hash } = options || {};
    let completionHash = hash || Es(); // Assuming Es() is a function returning a hash
    
    // Get or create the shadow root
    let saplingElement = $('#sapling-complete');
    let saplingShadowRoot = saplingElement[0].shadowRoot || $('sapling-complete').shadowRoot;

    // Get or set a default character
    let backtickCharacter = _o() || '`';

    // Create the HTML for the Sapling completion
    let completionHtml = `
      <style type="text/css">
        #sapling-complete-div {
          margin: 0;
          padding: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #525F99;
          opacity: 0.5;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        #sapling-complete-div-box {
          z-index: 2147483647 !important;
          display: table;
          margin: 0;
          padding: 0;
        }
      </style>
      <div id="sapling-complete-div-box">
        <div id="sapling-complete-div">
          <span completion-hash="${completionHash}">
            ${text.replace(' ', '&nbsp;')}
          </span>
          <span title="Hit the backtick or tab key to use Sapling's completion."
                style="margin-left: 1em; background: #ccc; font-weight: 500; border-radius: 0.2em; line-height: 0.6em; padding: 0 0.4em 0 0.3em;">
            ${backtickCharacter}
          </span>
        </div>
      </div>
    `;

    // Update the HTML content of the Sapling completion
    saplingShadowRoot.innerHTML = completionHtml;

    // Position the Sapling completion near the target element
    let saplingCompleteDiv = $('#sapling-complete-div', saplingShadowRoot);
    let elementPosition = getElementPosition(element);
    if (elementPosition) {
      positionSaplingComplete(saplingCompleteDiv, elementPosition);
    }
  } else {
    // Handle the case when the text is empty
    hideSaplingComplete();
  }
}

// Helper function to get the position of an element
function getElementPosition(element) {
  // Assuming ps() returns the position of the element
  return getCaretCoordinates(element);
}

// Helper function to position the Sapling completion near the target element
function positionSaplingComplete(saplingCompleteDiv, elementPosition) {
  if (saplingCompleteDiv && elementPosition) {
    let { top, left } = elementPosition;
    saplingCompleteDiv.offset({ top: top + window.scrollY, left: left + window.scrollX });
    
    // Additional logic to handle width adjustment if necessary
    let saplingCompleteBox = $('#sapling-complete-div-box');
    let elementRect = element.getBoundingClientRect();
    let overlap = saplingCompleteBox.offset().left + saplingCompleteBox.width() - (elementRect.left + elementRect.width);

    if (overlap > 0) {
      saplingCompleteDiv.css('max-width', saplingCompleteBox.width() - overlap);
    } else {
      saplingCompleteDiv.css('max-width', '');
    }

    // Make the Sapling completion visible with a delay
    ws(() => saplingCompleteBox.css('visibility', 'visible'));
  }
}

// Helper function to hide the Sapling completion
function hideSaplingComplete() {
  // Assuming ys() is a function to hide the completion
  ys();
}

function getCaretCoordinates(element) {
  // Check if the element is a textarea or input
  if (element.nodeName === 'TEXTAREA' || element.nodeName === 'INPUT') {
    return getCaretCoordinatesForInput(element);
  } else {
    return getCaretCoordinatesForContentEditable(element);
  }
}

// Helper function to get caret coordinates for input and textarea elements
function getCaretCoordinatesForInput(inputElement) {
  // Check if the browser supports caret position retrieval
  if (!hs) {
    throw new Error('getCaretCoordinates should only be called in a browser');
  }

  // Create a mirror div to simulate the text area for measurement
  var mirrorDiv = document.createElement('div');
  mirrorDiv.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(mirrorDiv);

  // Set styles for the mirror div
  var mirrorStyle = mirrorDiv.style;
  mirrorStyle.whiteSpace = 'pre-wrap';
  mirrorStyle.position = 'absolute';
  mirrorStyle.visibility = 'hidden';

  // Copy relevant styles from the input element to the mirror div
  copyStyles(inputElement, mirrorStyle);

  // Set additional styles for handling overflow
  if (gs) {
    inputElement.scrollHeight > parseInt(mirrorStyle.height) && (mirrorStyle.overflowY = 'scroll');
  } else {
    mirrorStyle.overflow = 'hidden';
  }

  // Set the text content of the mirror div
  mirrorDiv.textContent = inputElement.value.substring(0, inputElement.selectionEnd);

  // Create a span element to represent the caret position
  var caretSpan = document.createElement('span');
  caretSpan.textContent = inputElement.value.substring(inputElement.selectionEnd) || '.';
  mirrorDiv.appendChild(caretSpan);

  // Calculate the caret coordinates
  var caretCoordinates = {
    top: caretSpan.offsetTop + parseInt(mirrorStyle.borderTopWidth),
    left: caretSpan.offsetLeft + parseInt(mirrorStyle.borderLeftWidth),
    height: parseInt(mirrorStyle.fontSize)
  };

  // Clean up the mirror div
  document.body.removeChild(mirrorDiv);

  return caretCoordinates;
}

// Helper function to get caret coordinates for contenteditable elements
function getCaretCoordinatesForContentEditable(contentEditableElement) {
  var range = contentEditableElement.getRootNode().getSelection().getRangeAt(0);

  // Handle the case when the startOffset is 0
  if (range.startOffset === 0) {
    range = range.cloneRange();
    try {
      range.setEnd(range.startContainer, 1);
    } catch (error) {
      // Handle the case when setting the range end fails
      var startContainerRect = range.startContainer.getBoundingClientRect();
      var startContainerElement = $(range.startContainer);
      var top = startContainerRect.top;
      var left = startContainerRect.left + parseInt(startContainerElement.css('padding-left')) +
        parseInt(startContainerElement.css('border-left-width'));
      var height = parseInt(startContainerElement.css('padding-top')) +
        parseInt(startContainerElement.css('border-top-width')) +
        parseInt(startContainerElement.css('font-size'));

      return { left: left, top: top, height: height };
    }
  }

  // Get the bounding rectangle of the range
  var boundingRect = range.getBoundingClientRect();

  // Handle the case when the bounding rectangle has zeros for x and y
  if (boundingRect.x === 0 && boundingRect.y === 0) {
    // Insert a zero-width space character to measure the position
    var zeroWidthSpace = document.createTextNode('\ufeff');
    range.insertNode(zeroWidthSpace);

    // Get the bounding rectangle again after inserting the zero-width space
    boundingRect = range.getBoundingClientRect();

    // Remove the zero-width space
    zeroWidthSpace.remove();
  }

  return boundingRect;
}

// Helper function to copy relevant styles from source to target
function copyStyles(source, target) {
  var computedStyles = window.getComputedStyle ? window.getComputedStyle(source) : source.currentStyle;

  fs.forEach(function (styleProperty) {
    // Handle special case for line-height in input elements
    if (source.nodeName === 'INPUT' && styleProperty === 'lineHeight') {
      if ('border-box' === computedStyles.boxSizing) {
        var height = parseInt(computedStyles.height);
        var paddingTop = parseInt(computedStyles.paddingTop);
        var paddingBottom = parseInt(computedStyles.paddingBottom);
        var borderTopWidth = parseInt(computedStyles.borderTopWidth);
        var borderBottomWidth = parseInt(computedStyles.borderBottomWidth);
        var lineHeight = height > paddingTop + paddingBottom ? height - (paddingTop + paddingBottom) + 'px' : height === paddingTop + paddingBottom ? computedStyles.lineHeight : 0;

        target.lineHeight = lineHeight;
      } else {
        target.lineHeight = computedStyles.height;
      }
    } else {
      target[styleProperty] = computedStyles[styleProperty];
    }
  });
}
```
