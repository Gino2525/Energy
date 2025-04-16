import React from "react";
export default function Register() {
  return (
    <>
      <div className="login-header box-shadow">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="brand-logo">
            <a href="login.html">
              <img src="vendors/images/deskapp-logo.svg" alt="" />
            </a>
          </div>
          <div className="login-menu">
            <ul>
              <li>
                <a href="/">Login</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="register-page-wrap d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6 d-none d-md-block">
              <img src="vendors/images/register-page-img.png" alt="" className="img-fluid" />
            </div>
            <div className="col-md-6 col-lg-5">
              <div className="register-box bg-white box-shadow border-radius-10 p-4">
                <div className="wizard-content">
                  <form className="tab-wizard2 wizard-circle wizard">
                    <h5>Basic Account Credentials</h5>
                    <section>
                      <div className="form-wrap mx-auto">
                        <div className="form-group">
                          <label>Email Address*</label>
                          <input type="email" className="form-control" required />
                        </div>
                        <div className="form-group">
                          <label>Username*</label>
                          <input type="text" className="form-control" required />
                        </div>
                        <div className="form-group">
                          <label>Password*</label>
                          <input type="password" className="form-control" required />
                        </div>
                        <div className="form-group">
                          <label>Confirm Password*</label>
                          <input type="password" className="form-control" required />
                        </div>
                      </div>
                    </section>

                    <h5>Personal Information</h5>
                    <section>
                      <div className="form-wrap mx-auto">
                        <div className="form-group">
                          <label>Full Name*</label>
                          <input type="text" className="form-control" required />
                        </div>
                        <div className="form-group" >
                          <label>Gender*</label>
                          <div className="d-flex">
                            <div className="custom-control custom-radio mr-3">
                              <input type="radio" id="male" name="gender" className="custom-control-input" />
                              <label className="custom-control-label" htmlFor="male">Male</label>
                            </div>
                            <div className="custom-control custom-radio">
                              <input type="radio" id="female" name="gender" className="custom-control-input" />
                              <label className="custom-control-label" htmlFor="female">Female</label>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>DOB</label>
                          <input type="date" className="form-control" required />
                        </div>

                          <button type="submit" className="btn btn-primary btn-block mt-3">Register</button>
                        </div>
                     
                    </section>

                    {/* <h5>Payment Method & Info</h5>
                    <section>
                      <div className="form-wrap mx-auto">
                        <div className="form-group">
                          <label>Credit Card Type</label>
                          <select className="form-control">
                            <option>Select Card Type</option>
                            <option>Visa</option>
                            <option>MasterCard</option>
                            <option>American Express</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Credit Card Number</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="form-group d-flex">
                          <div className="mr-3">
                            <label>CVC</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div>
                            <label>Expiration Date</label>
                            <div className="d-flex">
                              <select className="form-control mr-2">
                                <option>Month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                              </select>
                              <select className="form-control">
                                <option>Year</option>
                                <option>2025</option>
                                <option>2026</option>
                                <option>2027</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




    </>
  );
}
