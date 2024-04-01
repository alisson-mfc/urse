import React from "react";
import "./style.scss";

function TutorialComponent() {
  return (
    <div>
      <h1>TUTORIAL URSE – AUTOMATED GRADE CLASSIFICATION</h1>
      <p>On the home screen, drag and drop or click on the gray box area to upload the systematic review you want to do the automated GRADE classification on. The review must be a PDF file.</p>
      <img src="./tutorial-1.png" style={{width: '70vw'}}/>

      <p>Once you have uploaded the PDF file, you will automatically be redirected to the next screen. On this screen, you will have to enter all the outcomes (O) and comparisons (intervention vs comparator - I-C) that you want to do the GRADE evaluation on. At this stage, it is mandatory to insert at least one line (I-C-O).</p>
      <img src="./tutorial-2.png" style={{width: '70vw'}}/>

      <p>To increase accuracy, we recommend that you write the outcomes and comparisons as they are written in the forest plots.</p>
      <img src="./tutorial-3.png" />
      <img src="./tutorial-4.png" />

      <p>Click on the "ADD" button if you want to insert another line.</p>
      <img src="./tutorial-5.png" style={{width: '70vw'}}/>

      <p>After entering all the lines, click on the "SUBMIT" button to continue.</p>

      <p>On the next screen, you will have to upload the clinical trials for each outcome-intervention-comparison strand entered on the previous screen. Click on the gray box or drag and drop the files to upload them.</p>
      <img src="./tutorial-6.png" />

      <p>After uploading all the files, click on the "Submit" button to continue.</p>
      <img src="./tutorial-7.png" />

      <p>After clicking "Submit", you will remain on the current screen until the system has processed all the files and finalized the GRADE classification. A bar will appear at the top of the screen indicating progress. At this point, you don't need to do anything else. Just wait for the process to finish.</p>
      <img src="./tutorial-8.png" style={{width: '70vw'}}/>

      <p>Once the process is complete, you will be redirected to a screen with the final GRADE evidence levels.</p>

     
    </div>
  );
}

export default TutorialComponent;
