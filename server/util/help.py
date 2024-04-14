from keras.models import load_model
import numpy as np
MAX_DATE = 10


def predict_future(X_test, num_date):
    # model = load_model('./model/final_model.h5')
    model = load_model('./model/final_model.h5')
    x_input = X_test.reshape(1, -1)
    temp_input = list(x_input)
    temp_input = temp_input[0].tolist()

    from numpy import array

    lst_output = []
    n_steps = MAX_DATE
    i = 0
    pred_days = num_date
    while (i < pred_days):

        if (len(temp_input) > MAX_DATE):

            x_input = np.array(temp_input[1:])
            # print("{} day input {}".format(i,x_input))
            x_input = x_input.reshape(1, -1)
            x_input = x_input.reshape((1, n_steps, 1))

            yhat = model.predict(x_input, verbose=0)
            # print("{} day output {}".format(i,yhat))
            temp_input.extend(yhat[0].tolist())
            temp_input = temp_input[1:]
            # print(temp_input)

            lst_output.extend(yhat.tolist())
            i = i+1

        else:

            x_input = x_input.reshape((1, n_steps, 1))
            yhat = model.predict(x_input, verbose=0)
            temp_input.extend(yhat[0].tolist())

            lst_output.extend(yhat.tolist())
            i = i+1
    return lst_output
