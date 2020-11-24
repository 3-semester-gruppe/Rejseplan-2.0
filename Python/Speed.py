import math
import time
# https://www.engineeringtoolbox.com/acceleration-velocity-d_1769.html


class CalculateSpeed:

    def __init__(self):
        # acceleration dictonary
        self.acc = {
            "user_x": 0,
            "user_z": 0
        }
        # initalize variabler
        self.fake_speed = 0
        self.constT = 0.01  # 10ms
        self.initialV = 0
        self.xVelocityFinal = 0
        self.zVelocityFinal = 0
        self.test = 0

    # laver noget hastighed regning udfra nuværende acceleration + ny accleeration
    def fakeVelocity(self, x, z, initial):
        velocity = x + z + initial
        return velocity

    # Omregner ny hastighed udfra givet acceleration over tid
    def getFinalVelocity(self, v_0, a, t):
        finalVelocity = v_0 + (a * t)
        return finalVelocity

    # regner hastighed ud
    def calculation(self, x, z):
        # omregner acceleration unit til m/s^2
        self.acc["user_x"] = x * 9.81
        self.acc["user_z"] = z * 9.81

        # udregner x og z vektor
        self.xVelocityFinal = self.getFinalVelocity(self.xVelocityFinal, self.acc["user_x"], self.constT)
        self.zVelocityFinal = self.getFinalVelocity(self.zVelocityFinal, self.acc["user_z"], self.constT)

        # udregner hastighed fra x og z vektor
        speed = math.sqrt((self.xVelocityFinal ** 2) + (self.zVelocityFinal ** 2))
        # converts to km/H
        speed_kmh = speed * 3.6
        time.sleep(self.constT)

        return round(speed_kmh, 2)

    # regner falsk data
    def fake_data(self,x, z):
        self.acc["user_x"] = x
        self.acc["user_z"] = z

        self.fake_speed = self.fakeVelocity(x, z, self.fake_speed)

        speed = self.fake_speed

        time.sleep(0.1)
        return round(speed,2)


        #print("Your speed is: {0} km/h".format(round(speedInKmH, 2)))

        # print("Your speed is: {0} m/s".format(round(speed,2)))
