import { Link } from "react-router-dom";

type propTypes = {
    label: string,
    description?: string,
    color: string,
    hoverColor: string,
    redirect: string
}

export default function HomeNavigationButton({label, description, color, hoverColor, redirect}: propTypes){

    return(
        <Link to={redirect} className={`rounded-2xl shadow-md p-6 text-white ${color} ${hoverColor} transform transition duration-200 hover:scale-105`}>
            <h3 className="text-xl font-semibold mb-2">{label}</h3>{description && <p className="text-sm opacity-90">{description}</p>}
        </Link>
    );

}