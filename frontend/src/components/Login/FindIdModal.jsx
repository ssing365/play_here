import { useState, useRef, useEffect } from "react";
import { Modal } from "bootstrap";

const FindIdModal = ({ modalRef }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [foundId, setFoundId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (modalRef?.current) {
            const modalInstance = new Modal(modalRef.current);

            // ✅ 모달이 닫힐 때 입력값 초기화
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setName("");
                setEmail("");
                setFoundId(null);
                setError("");
            });
        }
    }, [modalRef]);

    const handleFindId = async () => {
        setError("");
        setFoundId(null);

        // ✅ 입력값 검증 추가!
        if (!name.trim() || !email.trim()) {
            setError("이름과 이메일을 모두 입력해주세요.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8586/api/find-id", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();
            if (data.success) {
                setFoundId(data.userId);
            } else {
                setError("일치하는 아이디가 없습니다.");
            }
        } catch (error) {
            setError("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    return (
        <div className="modal fade" ref={modalRef} id="findIdModal" tabIndex="-1" aria-labelledby="findIdModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="findIdModalLabel">아이디 찾기</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <input type="text" className="form-control mb-2" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" className="form-control mb-2" placeholder="이메일 입력" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button className="btn btn-primary w-100" onClick={handleFindId}>아이디 찾기</button>
                        {foundId && <p className="mt-2">여기놀자 회원 아이디: <strong>{foundId}</strong></p>}
                        {error && <p className="mt-2 text-danger">{error}</p>}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindIdModal;