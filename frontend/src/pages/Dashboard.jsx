import { Appbar } from "../components/Appbar";
import { Users } from "../components/Users";
import { Balance } from "../components/Balance";


export default function Dashboard() {
    return (
        <div>
            <Appbar />
            <div className="m-8">
                <Balance/>
                <Users />
            </div>
        </div>
    );
}
