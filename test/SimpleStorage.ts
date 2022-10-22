import { ethers } from "hardhat"
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types"
import { expect, assert } from "chai"

describe("SimpleStorage", () => {
  let simpleStorageFactory: SimpleStorage__factory, simpleStorage: SimpleStorage

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  describe("favorite number", () => {
    it("should start with a favorite number of 0", async () => {
      const currentValue = await simpleStorage.retrieve()
      const expectedValue = "0"

      assert.equal(currentValue.toString(), expectedValue)
    })

    it("should update when we call store", async () => {
      const expectedValue = "7"
      const transactionResponse = await simpleStorage.store(expectedValue)
      await transactionResponse.wait(1)

      const updatedValue = await simpleStorage.retrieve()
      assert.equal(updatedValue.toString(), expectedValue)
    })
  })

  describe("person", () => {
    it("should start with empty person", async () => {
      await expect(simpleStorage.people("0")).to.rejectedWith()
    })
    it("should add person to the array", async () => {
      const personName = "John"
      const favoriteNumber = "10"

      const transactionResponse = await simpleStorage.addPerson(
        personName,
        favoriteNumber
      )
      await transactionResponse.wait(1)

      const person = await simpleStorage.people("0")
      assert.equal(person.name, personName)
      assert.equal(person.favoriteNumber.toString(), favoriteNumber)
    })

    it("should add person to the mapping", async () => {
      const personName = "Marrie"
      const favoriteNumber = "20"

      const transactionResponse = await simpleStorage.addPerson(
        personName,
        favoriteNumber
      )
      await transactionResponse.wait(1)

      const receivedFavoriteNumber = await simpleStorage.nameToFavoriteNumber(
        personName
      )

      assert.equal(receivedFavoriteNumber.toString(), favoriteNumber)
    })
  })
})
