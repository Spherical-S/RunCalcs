import { Link } from "react-router-dom";

type propTypes = {
    label: string,
    color: string,
    hoverColor: string,
    redirect: string
}

export default function({label, color, hoverColor, redirect}: propTypes){

    return(
        <Link to={redirect}>
            <button className={`w-3/4 px-5 py-2 ${color} text-white rounded cursor-pointer mb-3 ${hoverColor}`}>{label}</button>
        </Link>
    );

}