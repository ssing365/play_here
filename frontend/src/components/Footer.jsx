import { FaFacebook, FaTwitter } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsPinterest } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="text-center p-4 bg-gray-200 mt-20">
            <p className="mb-2">여기놀자를 SNS에서 만나보세요!</p>
            <div className="flex justify-center space-x-4 text-gray-500">
                <AiOutlineInstagram className="h-6 w-6" />
                <BsPinterest className="h-6 w-6" />
                <FaFacebook className="h-6 w-6" />
                <FaTwitter className="h-6 w-6" />
            </div>
        </footer>
    );
};

export default Footer;
