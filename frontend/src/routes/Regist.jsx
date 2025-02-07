import  { useState } from 'react';

const Regist = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    birth: '',
    phone: '',
    referral: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form submitted:', formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>회원가입</h2>
        <p style={styles.subtitle}>1920w light</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              아이디 <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              style={styles.input}
              placeholder="ID를 입력하세요"
            />
            <p style={styles.hint}>최소 3~20자 사이의 영문+숫자를 이용하여 아이디를 만드시기 바랍니다.</p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              비밀번호 <span style={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
            />
            <p style={styles.hint}>비밀번호는 6자리 이상이어야 하며 영문과 숫자를 반드시 포함해야 합니다.</p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              비밀번호 확인 <span style={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              style={styles.input}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              이름 <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              생년월일 <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="birth"
              value={formData.birth}
              onChange={handleChange}
              style={styles.input}
              placeholder="YYYYMMDD"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              성별 <span style={styles.required}>*</span>
              </label>
              <div>
            <input
              type="radio"
              name="men"
              value={formData.m}
              onChange={handleChange}
              style={styles.input}
              
              /> 남자 
            <input
              type="radio"
              name="women"
              value={formData.f}
              onChange={handleChange}
              style={styles.input}
              
              /> 여자
              </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              이메일 주소 <span style={styles.required}>*</span>
            </label>
            <div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="이메일을 입력하세요"
              />@ 
              <button className=''></button>
              </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>전화번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="전화번호를 입력하세요"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>주소
              
            </label>
            <button>주소찾기</button>
            <input
              type="addr"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
              placeholder=""
            />
          </div>

          <button type="submit" style={styles.button}>
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px'
  },
  formContainer: {
    background: '#ffffff',
    borderRadius: '15px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '5px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  required: {
    color: '#ff4646',
    fontSize: '16px'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: '#4a90e2'
    }
  },
  hint: {
    fontSize: '13px',
    color: '#666',
    marginTop: '4px'
  },
  button: {
    marginTop: '20px',
    padding: '14px',
    background: '#4a90e2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
    ':hover': {
      background: '#357abd'
    }
  }
};

export default Regist;