

export default function Footer() {


    return (
        <div>
            <footer className="footer">
                <div className="footer-content">
                    <p className="footer-text">&copy; {new Date().getFullYear()} FaREbook. All rights reserved.</p>
                    <div className="footer-links">
                        <a className="footer-link" href="https://www.facebook.com/legal/terms?paipv=0&eav=AfZSCzCkW2V_JU_kkZKF7bYh4oLzM2ZntYiscDXO_EhdEVI-6eAv-vnnfKq3SLgwHFA&_rdr">Terms & Conditions</a>
                        <a className="footer-link" href="https://www.facebook.com/help">Help Center</a>
                        <a className="footer-link" href="https://www.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0">Cookies</a>
                        <a className="footer-link" href="https://developers.facebook.com/?ref=pf">Developers</a>
                        <a className="footer-link" href="https://www.facebook.com/biz/directory/">Services</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}