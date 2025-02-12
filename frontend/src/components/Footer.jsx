import { FaFacebook, FaTwitter } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsPinterest } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="text-center py-4 bg-light mt-5">
            <p className="mb-2">여기놀자를 SNS에서 만나보세요!</p>
            <div className="d-flex justify-content-center gap-3 text-secondary">
                <AiOutlineInstagram className="fs-4" />
                <BsPinterest className="fs-4" />
                <FaFacebook className="fs-4" />
                <FaTwitter className="fs-4" />
            </div>
        </footer>
    );
};

export default Footer;

