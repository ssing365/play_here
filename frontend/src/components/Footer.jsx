import { FaFacebook, FaTwitter } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsPinterest } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
    const githubLinks = [
        { url: "https://github.com/jiayou0518" },
        { url: "https://github.com/ssing365" },
        { url: "https://github.com/JHeeR2" },
        { url: "https://github.com/curyi0" },
        { url: "https://github.com/jyj-123" },
    ];

    return (
        <footer className="text-center py-4 bg-light" style={{marginTop:"120px"}}>
            <p className="mb-2">여기놀자를 SNS에서 만나보세요!</p>
            <div className="d-flex justify-content-center gap-3 text-dark">
                <AiOutlineInstagram className="fs-4" />
                <BsPinterest className="fs-4" />
                <FaFacebook className="fs-4" />
                <FaTwitter className="fs-4" />
            </div>
            <hr className="divider" />
            <div className="d-flex justify-content-center gap-1 text-secondary">
                {githubLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center gap-1 text-secondary text-decoration-none"
                    >
                        <FaGithub className="fs-4" />
                    </a>
                ))}
            </div>
        </footer>
    );
};

export default Footer;
