import { decode } from "html-entities";

export default function Question(props) {
  let answers = props.answers;
  let color = props.grade != -1?true:false;
  return (
    <>
      <div>
        <h3>{decode(props.question)}</h3>

        <ul class="choices">
          {answers.map((a, ind) => {
            return (
              <li>
                <input
                  type="radio"
                  name={props.question}
                  id={'q'+props.index+'ans'+ind}
                  value={a.status}
                  onChange={()=>{props.update(props.index,ind,a.status)}}
                  className={color ? a.status=='incorrect'?'red':'green' : ''}
                />
                <label htmlFor={'q'+props.index+'ans'+ind}>{decode(a.answer)}</label>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
