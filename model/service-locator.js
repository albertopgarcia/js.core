module.exports = class
{
  constructor()
  {
    this.factories  = {}
    this.services   = {}
  }

  add(service, factory)
  {
    this.factories[service] = factory
  }

  async addBatch(origin, batch)
  {
    for(const key in batch)
    {
      const service = require(origin + '/' + batch[key])
      this.add(key, service)
    }
  }

  async create(service)
  {
    if(service in this.factories)
      return await this.factories[service].call(this)

    const error = new Error(`"${service}" does not have a specified factory`)
    error.code = 'ERR_SERVICE_FACTORY_UNDEFINED'
    throw error
  }

  async load(service)
  {
    return service in this.services
    ? this.services[service]
    : this.services[service] = await this.create(service)
  }
}