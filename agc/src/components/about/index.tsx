import React from "react";
import "./style.scss";

function AboutComponent() {
  return (
    <div>
      <div>
        <h1>URSE - Automated GRADE Classification</h1>
        <h4>Developed by:</h4>
        <ul>
          <li>Álisson Oliveira dos Santos</li>
          <li>Tales Mota Machado</li>
          <li>Vinícius Silva Belo</li>
          <li>Eduardo Sergio da Silva</li>
        </ul>

        <h5>
          Federal University of São João del-Rei - Divinópolis - Minas Gerais -
          Brazil
        </h5>
        <h5>
          Federal University of Ouro Preto - Ouro Preto - Minas Gerais - Brazil
        </h5>
      </div>
      <hr />
      <div>
        <h4>PUBLICATIONS:</h4>
        <ul>
          <li>
            2023:
            <ul>
              <li>The use of artificial intelligence for automating or semi-automating biomedical literature analyses: A scoping review</li>
              <li>Journal of Biomedical Informatics</li>

              <li><a target="_blank" href="https://doi.org/10.1016/j.jbi.2023.104389">https://doi.org/10.1016/j.jbi.2023.104389</a></li>
            </ul>
          </li>
        </ul>
      </div>
     
    </div>
  );
}

export default AboutComponent;
