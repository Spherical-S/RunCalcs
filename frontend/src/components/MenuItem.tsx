import { Link } from "react-router-dom";

type propTypes = {
    label: string,
    icon: string,
    redirect: string,
};

export default function MenuItem({label, icon, redirect}: propTypes){

    return(

        <Link to={redirect} className="flex gap-4 py-6 hover:bg-gray-300 rounded-2xl">
            <img src={icon} alt="icon" />
            <p>{label}</p>
        </Link>

    );

}