import { Routes, Route } from "react-router-dom";
import Path from "../path";
export default function MainRoutes(){
    return (
        <Routes>
            {Path().map((item,index)=>{
                return (
                    <Route key={index} path={item.path} element={item.element} />
                )
            })}
        </Routes>
    )
}