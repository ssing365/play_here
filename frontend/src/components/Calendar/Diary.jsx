import { useState, useContext, useEffect, useRef } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";

const Diary = ({
    coupleInfo,
    saveDiary,
    diaryText,
    yourDiaryText,
    setDiaryText,
    editDiary,
    setEditDiary,
}) => {
    return (
        <Row>
            <Col>
                <Card className="p-3 mb-2">
                    <h6>
                        <b>내 일기</b>
                    </h6>
                    {editDiary ? (
                        <div>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={diaryText}
                                onChange={(e) => setDiaryText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        saveDiary();
                                    }
                                }}
                                autoFocus
                            />
                            <div className="d-flex justify-content-end mt-2">
                                <Button onClick={saveDiary} className="add-btn" size="sm">
                                    저장
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p
                            onClick={() => setEditDiary(true)}
                            className="text-muted"
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            {diaryText || "일기를 남겨주세요"}
                        </p>
                    )}
                </Card>
            </Col>
            <Col>
                <Card className="p-3">
                    <h6>
                        <b>{coupleInfo ? coupleInfo.nickname : "Loading..."}</b>
                    </h6>
                    <p>
                        {yourDiaryText || "상대가 아직 일기를 남기지 않았어요"}
                    </p>
                </Card>
            </Col>
        </Row>
    );
};

export default Diary;
