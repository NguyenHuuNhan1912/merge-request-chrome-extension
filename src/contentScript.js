const characterSplit = '/'

function scrollToBottom() {

    window.scrollTo(0, document.body.scrollHeight);

}



// Function to check if the page has reached the bottom 

function isPageBottom() {

    return window.innerHeight + window.pageYOffset >= document.body.scrollHeight;

}
function splitCommitMessage(commitMessage) {
    const splitArray = commitMessage.split(' ');
    const commitId = splitArray.shift(); // Remove the first element and store it as commitId
    const commitDescription = splitArray.join(' '); // Join the remaining elements to form the description

    return [commitId, commitDescription];
}


// Recursive function to scroll to the bottom and execute the code when reached 
function generateTitle(commitValue) {
    const targetBranchElement = document.getElementById('js-target-branch-title');
    let targetBranchValue = '';
    if (targetBranchElement) {
        targetBranchValue = targetBranchElement.textContent.trim().toUpperCase()
    }
    const arrTargetBranch = targetBranchValue.split(characterSplit);
    const splitCommit = splitCommitMessage(commitValue);
    const result = `[${arrTargetBranch[0]}][${arrTargetBranch[2]}][${splitCommit[0].toUpperCase()}] ${splitCommit[1]}`;
    return result;
}

function generateDescription(commitValue) {
    const splitCommit = splitCommitMessage(commitValue);
    const result = `### Summary of Bug\n
<\`${splitCommit[1]}\`>
    
#### Task in Open Project
- [x] Status updated
- [x] Progressing updated
- [x] Time logged
That bug refer to these tickets:
1. [#${splitCommit[0].toUpperCase()}](https://bsc-oit.atlassian.net/browse/${splitCommit[0].toUpperCase()}) ${splitCommit[1]}

### Checklist
#### Code is well and up to date
- [x] **Pulled and broke** a new branch with **latest code** from working branch (base-branch)
- [x] All **merge conflicts are resolved**
- [x] **Build/executed** source code successful
- [x] **Tested** source code on local machine
- [x] Source code was **passed UT**
- [x] Run **linting** code was passed UT`;
    return result;
}
function scrollAndExecute() {


    // Get all elements with the class "commit flex-row js-toggle-container" 

    const commitRows = document.querySelectorAll('.commits-row');
    const commitsValue = [];
    // Loop through each commit row and extract the commit message
    commitRows.forEach(commitRow => {
        const commitMessage = commitRow.querySelector('.commit-row-message').textContent.trim();
        if (commitMessage && !commitMessage.includes('Merge branch')) {
            commitsValue.push(commitMessage)
        }
    });
    const inputTitleElement = document.getElementById('merge_request_title');
    if (inputTitleElement) {
        inputTitleElement.value = generateTitle(commitsValue[0])
    }
    const descriptionElement = document.getElementById('merge_request_description');
    if (descriptionElement) {
        descriptionElement.value = generateDescription(commitsValue[0])

    }

}



scrollAndExecute();