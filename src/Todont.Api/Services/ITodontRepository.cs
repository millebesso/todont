using Todont.Api.Models;

namespace Todont.Api.Services;

public interface ITodontRepository
{
    TodontList CreateList(string name);
    TodontList? GetList(string id);
    TodontItem AddItem(string listId, string description, DateTime? avoidUntil);
    bool UpdateItemStatus(string listId, string itemId, bool isChecked);
}
